import { DateInterval } from "@jmondi/date-interval";
import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { ClientCredentialsGrant } from "~/app/oauth/grants/client-credentials.grant";

@Injectable()
export class OAuthServerService {
  constructor(private readonly clientCredentialsGrant: ClientCredentialsGrant) {}

  respondToAccessTokenRequest(req: Request, res: Response) {
    const accessTokenTTL = new DateInterval({ hours: 1 });
    return this.clientCredentialsGrant.respondToAccessTokenRequest(req, res, accessTokenTTL);
  }
}
