import { DateInterval } from "@jmondi/date-interval";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request, Response } from "express";

import { AbstractGrant } from "~/app/oauth/grants/abstract.grant";
import { OAuthException } from "~/app/oauth/oauth.exception";
import { AccessTokenRepo } from "~/app/oauth/repositories/access_token.repository";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";

@Injectable()
export class ClientCredentialsGrant extends AbstractGrant {
  readonly GRANT_TYPE = "client_credentials";

  constructor(
    protected readonly jwt: JwtService,
    protected readonly clientRepository: ClientRepo,
    protected readonly accessTokenRepository: AccessTokenRepo,
    protected readonly scopeRepository: ScopeRepo,
  ) {
    super(clientRepository, accessTokenRepository, scopeRepository);
  }

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
}
