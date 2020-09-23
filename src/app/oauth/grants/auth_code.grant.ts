import { DateInterval } from "@jmondi/date-interval";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request, Response } from "express";

import { Client } from "~/app/oauth/entities/client.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { OAuthException } from "~/app/oauth/exceptions/oauth.exception";
import { GrantId } from "~/app/oauth/grants/abstract.grant";

import { AbstractAuthorizedGrant } from "~/app/oauth/grants/abstract_authorized.grant";
import { AccessTokenRepo } from "~/app/oauth/repositories/access_token.repository";
import { AuthCodeRepo } from "~/app/oauth/repositories/auth_code.repository";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { RefreshTokenRepo } from "~/app/oauth/repositories/refresh_token.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { AuthorizationRequest } from "~/app/oauth/requests/authorization.request";
import { RedirectResponse } from "~/app/oauth/responses/redirect.response";
import { UserRepo } from "~/lib/repositories/user/user.repository";

export interface IAuthCodePayload {
  client_id: string;
  auth_code_id: string;
  expire_time: number;
  scopes: string[];
  user_id?: string;
  redirect_uri?: string;
  code_challenge?: string;
  code_challenge_method?: string;
}

export type CodeChallengeMethod = "S256" | "plain";

export interface ICodeChallenge {
  method: CodeChallengeMethod;

  verifyCodeChallenge(codeVerifier: string, codeChallenge: string): boolean;
}

export class PlainVerifier implements ICodeChallenge {
  public readonly method = "plain";

  verifyCodeChallenge(codeVerifier: string, codeChallenge: string): boolean {
    console.log("verifyCodeChallenge plain")
    return false;
  }
}

export class S256Verifier implements ICodeChallenge {
  public readonly method = "S256";

  verifyCodeChallenge(codeVerifier: string, codeChallenge: string): boolean {
    console.log("verifyCodeChallenge s256")
    return false;
  }
}

@Injectable()
export class AuthCodeGrant extends AbstractAuthorizedGrant {
  readonly identifier: GrantId = "authorization_code";

  protected readonly authCodeTTL: DateInterval = new DateInterval({ minutes: 15 });

  private codeChallengeVerifiers = {
    plain: new PlainVerifier(),
    S256: new S256Verifier(),
  };

  constructor(
    protected readonly clientRepository: ClientRepo,
    protected readonly accessTokenRepository: AccessTokenRepo,
    protected readonly refreshTokenRepository: RefreshTokenRepo,
    protected readonly authCodeRepository: AuthCodeRepo,
    protected readonly scopeRepository: ScopeRepo,
    protected readonly userRepository: UserRepo,
    protected readonly jwt: JwtService,
  ) {
    super(
      clientRepository,
      accessTokenRepository,
      refreshTokenRepository,
      authCodeRepository,
      scopeRepository,
      userRepository,
      jwt,
    );
  }

  async respondToAccessTokenRequest(
    request: Request,
    response: Response,
    accessTokenTTL: DateInterval,
  ): Promise<Response<any>> {
    const [clientId] = this.getClientCredentials(request);

    const client = await this.clientRepository.getClientById(clientId);

    if (client.isConfidential) await this.validateClient(request);

    const encryptedAuthCode = request.body?.code;

    if (!encryptedAuthCode) {
      throw OAuthException.invalidRequest("code");
    }

    let validatedPayload: any;
    const scopes: Scope[] = [];
    try {
      validatedPayload = await this.validateAuthorizationCode(this.decrypt(encryptedAuthCode), client, request);
    } catch (e) {
      throw OAuthException.invalidRequest("code", "cannot decrypt the authorization code");
    }

    try {
      const finalizedScopes = await this.scopeRepository.finalizeScopes(
        await this.validateScopes(validatedPayload.scopes ?? []),
        this.identifier,
        client,
        validatedPayload.user_id,
      );
      finalizedScopes.forEach((scope) => scopes.push(scope));
    } catch (e) {
      throw OAuthException.invalidRequest("code", "cannot verify scopes");
    }

    /**
     * If the authorization server requires public clients to use PKCE,
     * and the authorization request is missing the code challenge,
     * then the server should return the error response with
     * error=invalid_request and the error_description or error_uri
     * should explain the nature of the error.
     */
    if (validatedPayload.code_challenge) {
      const codeVerifier = this.getRequestParameter("code_verifier", request);

      if (!codeVerifier) {
        throw OAuthException.invalidRequest("code_verifier");
      }

      // Validate code_verifier according to RFC-7636
      // @see: https://tools.ietf.org/html/rfc7636#section-4.1
      const codeVerifierRegex = /^[A-Za-z0-9-._~]{43,128}$/;
      if (!codeVerifierRegex.test(codeVerifier)) {
        throw OAuthException.invalidRequest(
          "code_verifier",
          "Code verifier must follow the specifications of RFS-7636",
        );
      }

      if (validatedPayload.code_challenge_method) {
        let verifier: ICodeChallenge;

        if (validatedPayload.code_challenge_method === "S256") {
          verifier = this.codeChallengeVerifiers.S256;
        } else if (validatedPayload.code_challenge_method === "plain") {
          verifier = this.codeChallengeVerifiers.plain;
        } else {
          throw OAuthException.serverError(`Unsupported code challenge method ${validatedPayload.code_challenge_method}`);
        }

        if (!verifier.verifyCodeChallenge(codeVerifier, validatedPayload.code_challenge)) {
          throw OAuthException.invalidGrant("Failed to verify `code_verifier`");
        }
      }
    }

    const accessToken = await this.issueAccessToken(accessTokenTTL, client, validatedPayload.user_id, scopes);

    const refreshToken = await this.issueRefreshToken(accessToken);

    await this.authCodeRepository.revokeAuthCode(validatedPayload.auth_code_id);

    return response.send({
      token_type: "Bearer",
      expires_in: (accessToken.expiresAt.getTime() - Date.now()),
      access_token: accessToken.token,
      refresh_token: refreshToken?.token,
    });
  }

  canRespondToAuthorizationRequest(request: Request): boolean {
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

    const stateParameter = this.getQueryStringParameter("state", request);

    const authorizationRequest = new AuthorizationRequest(this.identifier, client);

    authorizationRequest.state = stateParameter;

    authorizationRequest.scopes = scopes;

    if (redirectUri) authorizationRequest.redirectUri = redirectUri;

    const codeChallenge = this.getQueryStringParameter("code_challenge", request);

    if (codeChallenge) {
      const codeChallengeMethod = this.getQueryStringParameter("code_challenge_method", request, "plain");

      const codeChallengeRegExp = /^[A-Za-z0-9-._~]{43,128}$/g;

      if (!codeChallengeRegExp.test(codeChallenge)) {
        throw OAuthException.invalidRequest(
          "code_challenge",
          "Code challenge must follow the specifications of RFC-7636.",
        );
      }

      authorizationRequest.codeChallenge = codeChallenge;
      authorizationRequest.codeChallengeMethod = codeChallengeMethod;
    }

    return authorizationRequest;
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

      const payload: IAuthCodePayload = {
        client_id: authCode.client.id,
        redirect_uri: authCode.redirectUri,
        auth_code_id: authCode.token,
        scopes: authCode.scopes.map((scope) => scope.name),
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

  private async validateAuthorizationCode(payload: any, client: Client, request: Request) {
    if (!payload.auth_code_id) {
      throw OAuthException.invalidRequest("code", "Authorization code malformed");
    }

    if (Date.now() / 1000 > payload.expire_time) {
      throw OAuthException.invalidRequest("code", "Authorization code has expired");
    }

    if (await this.authCodeRepository.isAuthCodeRevoked(payload.auth_code_id)) {
      throw OAuthException.invalidRequest("code", "Authorization code has expired");
    }

    if (payload.client_id !== client.id) {
      throw OAuthException.invalidRequest("code", "Authorization code was not issued to this client");
    }

    const redirectUri = this.getRequestParameter("redirect_uri", request);
    if (!!payload.redirect_uri && !redirectUri) {
      throw OAuthException.invalidRequest("redirect_uri");
    }

    if (payload.redirect_uri !== redirectUri) {
      throw OAuthException.invalidRequest("redirect_uri", "Invalid redirect URI");
    }
    return payload;
  }

  private getClientRedirectUri(authorizationRequest: AuthorizationRequest): string {
    if (authorizationRequest.client.redirectUris.length === 0) throw OAuthException.missingRedirectUri();
    return authorizationRequest.client.redirectUris[0];
  }
}
