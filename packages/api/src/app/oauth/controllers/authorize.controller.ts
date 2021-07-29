import { Controller, Get, Req, Res } from "@nestjs/common";
import { AuthorizationRequest, base64encode, handleFastifyError, OAuthRequest } from "@jmondi/oauth2-server";
import querystring from "querystring";
import type { FastifyReply, FastifyRequest } from "fastify";

import { AuthorizationCookie } from "~/app/oauth/controllers/scopes.controller";
import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";
import { MyJwtService } from "~/lib/jwt/jwt.service";
import { COOKIES } from "~/config/cookies";
import { API_ROUTES } from "~/config/routes";

@Controller("oauth2/authorize")
export class AuthorizeController {
  constructor(private readonly oauth: AuthorizationServer, private readonly jwt: MyJwtService) {}

  @Get()
  async get(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const request = OAuthRequest.fromFastify(req);
    try {
      // Validate the HTTP request and return an AuthorizationRequest object.
      const authRequest = await this.oauth.validateAuthorizationRequest(request);

      // Once the user has logged in set the user on the AuthorizationRequest
      // The auth request object can be serialized and saved into a user's session.
      authRequest.user = req.user;

      if (!authRequest.user) {
        const str = this.getRedirectQuery(authRequest);
        res.cookie(COOKIES.redirectHelper, base64encode(str), this.oauth.cookieOptions({ maxAge: 0 }));
        res.redirect(API_ROUTES.login.template + "?" + str);
        return;
      }

      let authorizationCookie: AuthorizationCookie | any = undefined;

      if (req.cookies[COOKIES.authorization]) {
        authorizationCookie = await this.jwt.verify(req.cookies[COOKIES.authorization]);
      }

      // At this point you should redirect the user to an authorization page.
      // This form will ask the user to approve the client and the scopes requested.
      authRequest.isAuthorizationApproved =
        authRequest.scopes.length === 0 || authorizationCookie?.isAuthorizationApproved;

      // Once the user has approved or denied the client update the status
      // (true = approved, false = denied)
      if (!authRequest.isAuthorizationApproved) {
        const str = this.getRedirectQuery(authRequest);
        res.redirect(API_ROUTES.scopes.template + "?" + str);
        return;
      }

      // Return the HTTP redirect response
      const response = await this.oauth.completeAuthorizationRequest(authRequest);

      res.status(response.status);
      res.redirect(response.headers.location);
      return;
    } catch (e) {
      handleFastifyError(e, res);
      return;
    }
  }

  private getRedirectQuery(authRequest: AuthorizationRequest): string {
    return querystring.stringify({
      response_type: "code",
      client_id: authRequest.client?.id,
      redirect_uri: authRequest.redirectUri,
      scope: authRequest.scopes.map((scope) => scope.name),
      state: authRequest.state,
      code_challenge: authRequest.codeChallenge,
      code_challenge_method: authRequest.codeChallengeMethod,
      user_id: authRequest.user?.id,
    });
  }
}
