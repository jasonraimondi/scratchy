import { DateInterval } from "@jmondi/date-interval";
import { HttpCode, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request, Response } from "express";
import { AccessToken } from "~/app/oauth/entities/access_token.entity";
import { Client } from "~/app/oauth/entities/client.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { OAuthException } from "~/app/oauth/oauth.exception";

import { AccessTokenRepo } from "~/app/oauth/repositories/access_token.repository";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { arrayDiff } from "~/lib/helpers/array";
import { base64decode } from "~/lib/utils/base64";

@Injectable()
export class ClientCredentialsGrant {
  private readonly SCOPE_DELIMITER_STRING = " ";

  private readonly GRANT_TYPE = "client_credentials";

  constructor(
    private readonly jwt: JwtService,
    private readonly clientRepository: ClientRepo,
    private readonly accessTokenRepository: AccessTokenRepo,
    private readonly scopeRepository: ScopeRepo,
  ) {}

  async respondToAccessTokenRequest(request: Request, response: Response, accessTokenTTL: DateInterval) {
    const [clientId, clientSecret] = this.getClientCredentials(request);

    const grantType = this.getGrantType(request);

    if (grantType !== this.GRANT_TYPE) {
      throw OAuthException.invalidGrant();
    }

    const client = await this.clientRepository.getClientById(clientId);

    if (!(await this.clientRepository.validateClient(grantType, clientId, clientSecret))) {
      throw OAuthException.errorValidatingClient();
    }

    const bodyScopes = request.body?.scopes ?? [];

    const validScopes = await this.validateScopes(bodyScopes);

    const userId = undefined;

    const accessToken = await this.issueAccessToken(accessTokenTTL, client, userId, validScopes);

    const expiresIn = accessTokenTTL.toSeconds();

    const jwtSignedToken = this.jwt.sign(accessToken.toJWT, { expiresIn });

    return response.send({
      token_type: "Bearer",
      expires_in: accessTokenTTL.toSeconds(),
      access_token: jwtSignedToken,
    });
  }

  private getClientCredentials(request: Request): [string, string | undefined] {
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

  private getBasicAuthCredentials(request: Request) {
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

  private async issueAccessToken(
    accessTokenTTL: DateInterval,
    client: Client,
    userId?: string,
    scopes: Scope[] = [],
  ): Promise<AccessToken> {
    const accessToken = await this.accessTokenRepository.getNewToken(client, scopes, userId);
    accessToken.expiresAt = accessTokenTTL.end();
    return await this.accessTokenRepository.persistNewAccessToken(accessToken);
  }

  private async validateScopes(scopes: string | string[]) {
    if (typeof scopes === "string") {
      scopes = scopes.split(this.SCOPE_DELIMITER_STRING);
    }

    const validScopes = await this.scopeRepository.getScopesByIdentifier(scopes);

    const invalidScopes = arrayDiff(
      scopes,
      validScopes.map((scope) => scope.name),
    );

    if (invalidScopes.length > 0) {
      throw OAuthException.invalidRequest(`invalid scopes: (${invalidScopes.join(" ")})`);
    }

    return validScopes;
  }

  private getGrantType(request: Request): string {
    const result = request.body?.grant_type;
    if (!result) throw OAuthException.invalidRequest("grant_type");
    return result;
  }
}
