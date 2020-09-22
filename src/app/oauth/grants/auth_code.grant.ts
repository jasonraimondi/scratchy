import { DateInterval } from "@jmondi/date-interval";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import type { Request } from "express";

import { AuthCode } from "~/app/oauth/entities/auth_code.entity";
import { Client } from "~/app/oauth/entities/client.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { GrantType } from "~/app/oauth/grants/abstract.grant";

import { AbstractAuthorizedGrant } from "~/app/oauth/grants/abstract_authorized.grant";
import { OAuthException } from "~/app/oauth/exceptions/oauth.exception";
import { AccessTokenRepo } from "~/app/oauth/repositories/access_token.repository";
import { AuthCodeRepo } from "~/app/oauth/repositories/auth_code.repository";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { RedirectResponse } from "~/app/oauth/responses/redirect.response";
import { User } from "~/entity/user/user.entity";
import { UserRepo } from "~/lib/repositories/user/user.repository";

@Injectable()
export class AuthCodeGrant extends AbstractAuthorizedGrant {
  public readonly identifier: GrantType = "authorization_code";

  protected readonly authCodeTTL: DateInterval = new DateInterval({ minutes: 15 });

  constructor(
    protected readonly clientRepository: ClientRepo,
    protected readonly accessTokenRepository: AccessTokenRepo,
    protected readonly authCodeRepository: AuthCodeRepo,
    protected readonly scopeRepository: ScopeRepo,
    protected readonly userRepository: UserRepo,
    protected readonly jwt: JwtService,
  ) {
    super(clientRepository, accessTokenRepository, authCodeRepository, scopeRepository, userRepository, jwt);
  }

  async respondToAccessTokenRequest(request: Request, response: Response, accessTokenTTL: DateInterval) {
    const [clientId] = this.getClientCredentials(request);

    const client = await this.clientRepository.getClientById(clientId);

    if (client.isConfidential) await this.validateClient(request);

    const encryptedAuthCode = request.body?.code;

    if (!encryptedAuthCode) {
      throw OAuthException.invalidRequest("code");
    }

    try {

    const payload = this.jwt.decode(encryptedAuthCode)

    this.validateAuthorizationCode(payload, client, request)

    console.log({payload});
    } catch (e) {
      console.log(e)
    }

    // @todo HERE HERE
    // throw new OAuthException("HERERE");
    return response.send({
      token_type: "Bearer",
      expires_in: "",
      acccess_token: "",
      refresh_token: "",
    })
  }

  async canRespondToAuthorizationRequest(request: Request): Promise<boolean> {
    return request.query?.response_type === "code" && !!request.query?.client_id;
  }

  async validateAuthorizationRequest(request: Request): Promise<AuthorizationRequest> {
    const clientId = request.query?.client_id;

    if (!clientId || Array.isArray(clientId)) {
      throw OAuthException.invalidRequest("client_id");
    }

    const client = await this.clientRepository.getClientById(clientId.toString());

    let redirectUri = String(request.query?.redirect_uri);

    if (Array.isArray(redirectUri) && redirectUri.length === 1) redirectUri = redirectUri[0];

    if (redirectUri) {
      this.validateRedirectUri(redirectUri, client);
    } else {
      redirectUri = client.redirectUris?.[0];
    }

    // @todo add test for scopes as string or string[]
    let bodyScopes = (request.query as any)?.scope ?? [];

    if (typeof bodyScopes === "string") bodyScopes = bodyScopes.split(this.scopeDelimiterString);

    const scopes = await this.validateScopes(bodyScopes);

    const stateParameter = (request.query as any)?.state;

    return this.makeAuthorizationRequest(client, stateParameter, scopes, redirectUri);
  }

  async completeAuthorizationRequest(authorizationRequest: AuthorizationRequest): Promise<RedirectResponse> {
    if (!authorizationRequest.user) {
      throw new OAuthException("authorization request error user not found", 500);
    }

    const finalRedirectUri = authorizationRequest.redirectUri ?? this.getClientRedirectUri(authorizationRequest);

    if (authorizationRequest.isAuthorizationApproved) {
      const authCode = await this.issueAuthCode(
        this.authCodeTTL,
        authorizationRequest.client,
        authorizationRequest.user?.id,
        authorizationRequest.redirectUri,
        authorizationRequest.scopes,
      );

      const payload = {
        client_id: authCode.client.id,
        redirect_url: authCode.redirectUri,
        auth_code_id: authCode.token,
        scopes: authCode.scopes.map(scope => scope.name),
        user_id: authCode.userId,
        expire_time: this.authCodeTTL.end().getTime() / 1000,
        code_challenge: authorizationRequest.codeChallenge,
        code_challenge_method: authorizationRequest.codeChallengeMethod,
      };

      const jsonPayload = JSON.stringify(payload);

      return new RedirectResponse(
        this.makeRedirectUrl(finalRedirectUri, {
          code: await this.encrypt(jsonPayload),
          state: authorizationRequest.state,
        }),
      );
    }

    throw new OAuthException("error something went wrong", 500);
  }

  private makeAuthorizationRequest(client: Client, stateParameter: any, scopes: Scope[], redirectUri: string) {
    const authorizationRequest = new AuthorizationRequest(this.identifier, client);
    authorizationRequest.state = stateParameter;
    authorizationRequest.scopes = scopes;
    if (redirectUri) authorizationRequest.redirectUri = redirectUri;
    return authorizationRequest;
  }

  private validateRedirectUri(redirectUri: string, client: Client) {
    if (redirectUri === "" || !client.redirectUris.includes(redirectUri)) {
      throw OAuthException.invalidClient();
    }
  }

  private getClientRedirectUri(authorizationRequest: AuthorizationRequest): string {
    if (authorizationRequest.client.redirectUris.length === 0) throw OAuthException.missingRedirectUri();
    return authorizationRequest.client.redirectUris[0];
  }

  async issueAuthCode(
    authCodeTTL: DateInterval,
    client: Client,
    userIdentifier?: string,
    redirectUri?: string,
    scopes: Scope[] = [],
  ): Promise<AuthCode> {
    const user = userIdentifier ? await this.userRepository.getByUserIdentifier(userIdentifier) : undefined;

    const authCode = await this.authCodeRepository.getNewAuthCode(client, user, scopes);

    authCode.expiresAt = authCodeTTL.end();

    authCode.redirectUri = redirectUri;

    scopes.forEach((scope) => authCode.scopes ? authCode.scopes.push(scope) : authCode.scopes = [scope]);

    // @todo consider adding max generation loop
    return await this.authCodeRepository.persistNewAuthCode(authCode);
  }

  private async validateClient(request: Request) {
    const [clientId, clientSecret] = this.getClientCredentials(request);

    if (!(await this.clientRepository.validateClient(this.identifier, clientId, clientSecret))) {
      throw OAuthException.errorValidatingClient();
    }
  }

  private validateAuthorizationCode(payload: any, client: Client, request: Request) {
    console.log({ payload, client, request })
  }
}

export class AuthorizationRequest {
  scopes: Scope[] = [];
  isAuthorizationApproved: boolean;
  redirectUri?: string;
  state?: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;

  constructor(public readonly grantTypeId: GrantType, public readonly client: Client, public user?: User) {
    this.scopes = [];
    this.isAuthorizationApproved = false;
  }
}
