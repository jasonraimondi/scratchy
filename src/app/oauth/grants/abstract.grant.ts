import { DateInterval } from "@jmondi/date-interval";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import crypto from "crypto";
import type { Request } from "express";
import { Response } from "express";

import { AccessToken } from "~/app/oauth/entities/access_token.entity";
import { AuthCode } from "~/app/oauth/entities/auth_code.entity";
import { Client } from "~/app/oauth/entities/client.entity";
import { RefreshToken } from "~/app/oauth/entities/refresh_token.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { OAuthException } from "~/app/oauth/exceptions/oauth.exception";
import { AccessTokenRepo } from "~/app/oauth/repositories/access_token.repository";
import { AuthCodeRepo } from "~/app/oauth/repositories/auth_code.repository";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { RefreshTokenRepo } from "~/app/oauth/repositories/refresh_token.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { AuthorizationRequest } from "~/app/oauth/requests/authorization.request";
import { RedirectResponse } from "~/app/oauth/responses/redirect.response";
import { arrayDiff } from "~/lib/helpers/array";
import { UserRepo } from "~/lib/repositories/user/user.repository";
import { base64decode } from "~/lib/utils/base64";

export type GrantId = "authorization_code" | "client_credentials";

export interface IGrant {
  identifier: GrantId;

  respondToAccessTokenRequest(
    request: Request,
    response: Response,
    accessTokenTTL: DateInterval,
  ): Promise<Response<any>>;

  canRespondToAuthorizationRequest(request: Request): boolean;

  validateAuthorizationRequest(request: Request): Promise<AuthorizationRequest>;

  completeAuthorizationRequest(authorizationRequest: AuthorizationRequest): Promise<RedirectResponse>;

  canRespondToAccessTokenRequest(request: Request): boolean;
}

@Injectable()
export abstract class AbstractGrant implements IGrant {
  protected readonly scopeDelimiterString = " ";

  protected readonly supportedGrantTypes: GrantId[] = ["client_credentials", "authorization_code"];

  abstract readonly identifier: GrantId;

  constructor(
    protected readonly clientRepository: ClientRepo,
    protected readonly accessTokenRepository: AccessTokenRepo,
    protected readonly refreshTokenRepository: RefreshTokenRepo,
    protected readonly authCodeRepository: AuthCodeRepo,
    protected readonly scopeRepository: ScopeRepo,
    protected readonly userRepository: UserRepo,
    protected readonly jwt: JwtService,
  ) {}

  protected async validateClient(request: Request): Promise<Client> {
    const [clientId, clientSecret] = this.getClientCredentials(request);

    if (!(await this.clientRepository.validateClient(this.identifier, clientId, clientSecret))) {
      throw OAuthException.errorValidatingClient();
    }
    // @todo we are querying the client twice here and that is stupid
    return await this.clientRepository.getClientById(clientId);
  }

  protected getClientCredentials(request: Request): [string, string | undefined] {
    const [basicAuthUser, basicAuthPass] = this.getBasicAuthCredentials(request);

    // @todo is this being body okay?
    let clientId = request.body?.["client_id"] ?? basicAuthUser;

    if (!clientId) throw OAuthException.invalidRequest("client_id");

    // @todo is this being body okay?
    let clientSecret = request.body?.["client_secret"] ?? basicAuthPass;

    if (Array.isArray(clientId)) clientId = clientId[0];

    if (Array.isArray(clientSecret)) clientSecret = clientSecret[0];

    return [clientId, clientSecret];
  }

  protected getBasicAuthCredentials(request: Request) {
    if (!request.headers?.hasOwnProperty("authorization")) {
      return [undefined, undefined];
    }

    const header = request.headers["authorization"];

    if (!header || !header.startsWith("Basic ")) {
      return [undefined, undefined];
    }

    const decoded = base64decode(header.substr(6, header.length));

    if (!decoded.includes(":")) {
      return [undefined, undefined];
    }

    return decoded.split(":");
  }

  protected validateRedirectUri(redirectUri: string, client: Client) {
    if (redirectUri === "" || !client.redirectUris.includes(redirectUri)) {
      throw OAuthException.invalidClient();
    }
  }

  protected async validateScopes(scopes: string | string[], redirectUri?: string) {
    if (typeof scopes === "string") {
      scopes = scopes.split(this.scopeDelimiterString);
    }

    const validScopes = await this.scopeRepository.getScopesByIdentifier(scopes);

    const invalidScopes = arrayDiff(
      scopes,
      validScopes.map((scope) => scope.name),
    );

    if (invalidScopes.length > 0) {
      throw OAuthException.invalidScopes(invalidScopes, redirectUri);
    }

    return validScopes;
  }

  protected async issueAccessToken(
    accessTokenTTL: DateInterval,
    client: Client,
    userId?: string,
    scopes: Scope[] = [],
  ): Promise<AccessToken> {
    const accessToken = await this.accessTokenRepository.getNewToken(client, scopes, userId);

    accessToken.expiresAt = accessTokenTTL.end();

    return await this.accessTokenRepository.persistNewAccessToken(accessToken);
  }

  protected async issueAuthCode(
    authCodeTTL: DateInterval,
    client: Client,
    userIdentifier?: string,
    redirectUri?: string,
    codeChallenge?: string,
    codeChallengeMethod?: string,
    scopes: Scope[] = [],
  ): Promise<AuthCode> {
    const user = userIdentifier ? await this.userRepository.getByUserIdentifier(userIdentifier) : undefined;

    const authCode = await this.authCodeRepository.getNewAuthCode(client, user, scopes);

    authCode.expiresAt = authCodeTTL.end();

    authCode.redirectUri = redirectUri;

    authCode.codeChallenge = codeChallenge;
    authCode.codeChallengeMethod = codeChallengeMethod;

    scopes.forEach((scope) => (authCode.scopes ? authCode.scopes.push(scope) : (authCode.scopes = [scope])));

    return await this.authCodeRepository.persistNewAuthCode(authCode);
  }

  protected async issueRefreshToken(accessToken: AccessToken): Promise<RefreshToken | undefined> {
    const refreshToken = await this.refreshTokenRepository.getNewToken(accessToken);

    if (!refreshToken) {
      return;
    }

    return await this.refreshTokenRepository.persistNewRefreshToken(refreshToken);
  }

  protected generateUniqueIdentifier(len = 40) {
    return crypto.randomBytes(len).toString("hex");
  }

  protected getGrantType(request: Request): GrantId {
    const result = request.body?.grant_type ?? request.query?.grant_type;
    if (!result) throw OAuthException.invalidRequest("grant_type");
    if (!this.supportedGrantTypes.includes(result)) throw OAuthException.invalidRequest("grant_type");
    return result;
  }

  protected getRequestParameter(param: string, request: Request, defaultValue?: any) {
    return request.body?.[param] ?? defaultValue;
  }

  protected getQueryStringParameter(param: string, request: Request, defaultValue?: any) {
    return (request.query as any)?.[param] ?? defaultValue;
  }

  protected encrypt(unencryptedData: string): Promise<string> {
    return this.jwt.signAsync(unencryptedData);
  }

  protected decrypt(encryptedData: string) {
    return this.jwt.decode(encryptedData);
  }

  validateAuthorizationRequest(request: Request): Promise<AuthorizationRequest> {
    throw new Error("not implemented error");
  }

  canRespondToAccessTokenRequest(request: Request): boolean {
    return request.body?.grant_type === this.identifier;
  }

  canRespondToAuthorizationRequest(request: Request): boolean {
    return false;
  }

  async completeAuthorizationRequest(authorizationRequest: AuthorizationRequest): Promise<RedirectResponse> {
    throw new Error("not implemented error");
  }

  // not included in phpoauth

  async respondToAccessTokenRequest(
    request: Request,
    response: Response,
    accessTokenTTL: DateInterval,
  ): Promise<Response<any>> {
    throw new Error("not implemented error");
  }
}
