import { DateInterval } from "@jmondi/date-interval";
import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { IGrantType } from "~/app/oauth/grants/abstract.grant";
import { ClientCredentialsGrant } from "~/app/oauth/grants/client-credentials.grant";
import { OAuthException } from "~/app/oauth/oauth.exception";

@Injectable()
export class OAuthServerService {
  enabledGrantTypes: IGrantType[] = [];

  constructor(private readonly clientCredentialsGrant: ClientCredentialsGrant) {}

  respondToAccessTokenRequest(req: Request, res: Response) {
    const accessTokenTTL = new DateInterval({ hours: 1 });
    return this.clientCredentialsGrant.respondToAccessTokenRequest(req, res, accessTokenTTL);
  }

  validateAuthorizationRequest(req: Request) {
    for (const grantType of this.enabledGrantTypes) {
      if (grantType.canRespondToAuthorizationRequest(req)) {
        return grantType.validateAuthorizationRequest(req);
      }
    }

    throw OAuthException.unsupportedGrantType();
  }
}
