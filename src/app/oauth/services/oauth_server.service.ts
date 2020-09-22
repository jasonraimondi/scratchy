import { DateInterval } from "@jmondi/date-interval";
import { Request, Response } from "express";

import { IGrantType } from "~/app/oauth/grants/abstract.grant";
import { AuthCodeGrant, AuthorizationRequest } from "~/app/oauth/grants/auth_code.grant";
import { OAuthException } from "~/app/oauth/exceptions/oauth.exception";
import { ClientCredentialsGrant } from "~/app/oauth/grants/client_credentials.grant";

export class AuthorizationServer {
  private readonly enabledGrantTypes: { [key: string]: IGrantType } = {};
  private readonly grantTypeAccessTokenTTL: { [key: string]: DateInterval } = {};

  enableGrantType(grantType: IGrantType, accessTokenTTL?: DateInterval) {
    if (!accessTokenTTL) accessTokenTTL = new DateInterval("PT1H");
    this.enabledGrantTypes[grantType.identifier] = grantType;
    this.grantTypeAccessTokenTTL[grantType.identifier] = accessTokenTTL;
  }

  respondToAccessTokenRequest(req: Request, res: Response) {
    for (const grantType of Object.values(this.enabledGrantTypes)) {
      if (!grantType.canRespondToAccessTokenRequest(req)) {
        continue;
      }
      if (grantType instanceof ClientCredentialsGrant || grantType instanceof AuthCodeGrant) {
        const accessTokenTTL = this.grantTypeAccessTokenTTL[grantType.identifier];
        return grantType.respondToAccessTokenRequest(req, res, accessTokenTTL);
      }
    }

    throw OAuthException.unsupportedGrantType();
  }

  validateAuthorizationRequest(req: Request) {
    for (const grantType of Object.values(this.enabledGrantTypes)) {
      if (grantType instanceof AuthCodeGrant) {
        if (grantType.canRespondToAuthorizationRequest(req)) {
          return grantType.validateAuthorizationRequest(req);
        }
      }
    }

    throw OAuthException.unsupportedGrantType();
  }

  async completeAuthorizationRequest(authorizationRequest: AuthorizationRequest, response: Response): Promise<void> {
    const grant = this.enabledGrantTypes[authorizationRequest.grantTypeId];
    if (grant instanceof AuthCodeGrant) {
      const completedRequest = await grant.completeAuthorizationRequest(authorizationRequest);
      return completedRequest.generateHttpResponse(response);
    }
  }
}
