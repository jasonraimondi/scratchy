import { DateInterval } from "@jmondi/date-interval";
import { Injectable } from "@nestjs/common";
import type { Request, Response } from "express";

import { AbstractGrant } from "~/app/oauth/grants/abstract.grant";
import { OAuthException } from "~/app/oauth/exceptions/oauth.exception";

@Injectable()
export class ClientCredentialsGrant extends AbstractGrant {
  readonly identifier = "client_credentials";

  async respondToAccessTokenRequest(
    request: Request,
    response: Response,
    accessTokenTTL: DateInterval,
  ): Promise<Response> {
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
