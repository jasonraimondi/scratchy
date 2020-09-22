import { DateInterval } from "@jmondi/date-interval";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request, Response } from "express";

import { AbstractGrant } from "~/app/oauth/grants/abstract.grant";
import { OAuthException } from "~/app/oauth/exceptions/oauth.exception";
import { AccessTokenRepo } from "~/app/oauth/repositories/access_token.repository";
import { AuthCodeRepo } from "~/app/oauth/repositories/auth_code.repository";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { UserRepo } from "~/lib/repositories/user/user.repository";

@Injectable()
export class ClientCredentialsGrant extends AbstractGrant {
  public readonly identifier = "client_credentials";

  constructor(
    protected readonly clientRepository: ClientRepo,
    protected readonly accessTokenRepository: AccessTokenRepo,
    protected readonly authCodeRepo: AuthCodeRepo,
    protected readonly scopeRepository: ScopeRepo,
    protected readonly userRepository: UserRepo,
    protected readonly jwt: JwtService,
  ) {
    super(clientRepository, accessTokenRepository, authCodeRepo, scopeRepository, userRepository, jwt);
  }

  async respondToAccessTokenRequest(request: Request, response: Response, accessTokenTTL: DateInterval) {
    const [clientId, clientSecret] = this.getClientCredentials(request);

    const grantType = this.getGrantType(request);

    if (grantType !== this.identifier) {
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
}
