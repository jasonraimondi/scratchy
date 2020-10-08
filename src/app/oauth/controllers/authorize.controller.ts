import { AuthorizationRequest, OAuthException, OAuthRequest } from "@jmondi/oauth2-server";
import { Controller, Get, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import querystring from "querystring";
import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";
import { MyJwtService } from "~/app/oauth/services/jwt.service";
import { UserRepo } from "~/lib/repositories/user/user.repository";

@Controller("oauth2/authorize")
export class AuthorizeController {
  constructor(
    private readonly oauth: AuthorizationServer,
    private readonly userRepository: UserRepo,
    private readonly jwt: MyJwtService,
  ) {}

  @Get()
  async get(@Req() req: Request, @Res() res: Response) {
    const request = new OAuthRequest(req);
    try {
      // Validate the HTTP request and return an AuthorizationRequest object.
      const authRequest = await this.oauth.validateAuthorizationRequest(request);

      // Once the user has logged in set the user on the AuthorizationRequest
      // The auth request object can be serialized and saved into a user's session.
      if (!req.cookies.jwt) {
        const str = this.getRedirectQuery(authRequest);
        res.redirect("/oauth2/login?" + str);
        return;
      }

      const decoded: any = this.jwt.decode(req.cookies.jwt);

      if (!decoded.userId) {
        throw OAuthException.logicException("invalid user something fix this error");
      }
      authRequest.user = await this.userRepository.findById(decoded.userId);

      // At this point you should redirect the user to an authorization page.
      // This form will ask the user to approve the client and the scopes requested.
      authRequest.isAuthorizationApproved = req.cookies.isAuthenticated === "true";

      // authRequest.isAuthorizationApproved = authRequest.scopes.length === 0 || req.cookies.isAuthenticated === "true";

      // Once the user has approved or denied the client update the status
      // (true = approved, false = denied)
      if (!authRequest.isAuthorizationApproved) {
        const str = this.getRedirectQuery(authRequest);
        res.redirect("/oauth2/scopes?" + str);
        return;
      }

      // Return the HTTP redirect response
      const response = await this.oauth.completeAuthorizationRequest(authRequest);

      res.status(response.status);
      res.redirect(response.headers.location);
      return;
    } catch (e) {
      this.oauth.handleError(e, res);
      return;
    }
  }

  private getRedirectQuery(authRequest: AuthorizationRequest): string {
    const query = {
      response_type: "code",
      client_id: authRequest.client?.id,
      redirect_uri: authRequest.redirectUri,
      scope: authRequest.scopes.map((scope) => scope.name),
      state: authRequest.state,
      code_challenge: authRequest.codeChallenge,
      code_challenge_method: authRequest.codeChallengeMethod,
      user_id: authRequest.user?.id,
    };
    return querystring.stringify(query);
  }
}
