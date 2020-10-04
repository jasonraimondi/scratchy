import { OAuthException, OAuthRequest, OAuthResponse } from "@jmondi/oauth2-server";
import { Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";
import { UserRepo } from "~/lib/repositories/user/user.repository";
import { userGenerator } from "~test/generators/user.generator";

@Controller("oauth2")
export class OAuthController {
  constructor(private readonly oauth: AuthorizationServer, private readonly userRepository: UserRepo) {
    this.oauth.enableGrantType("client_credentials");
    this.oauth.enableGrantType("authorization_code");
    this.oauth.enableGrantType("refresh_token");
  }

  @Get("/authorize")
  async authorize(@Req() req: Request, @Res() res: Response) {
    const request = new OAuthRequest(req);
    try {
      // Validate the HTTP request and return an AuthorizationRequest object.
      const authRequest = await this.oauth.validateAuthorizationRequest(request);

      // The auth request object can be serialized and saved into a user's session.
      // You will probably want to redirect the user at this point to a login endpoint.

      // Once the user has logged in set the user on the AuthorizationRequest
      console.log("Once the user has logged in set the user on the AuthorizationRequest");
      const user = await this.userRepository.create(await userGenerator());
      authRequest.user = user;

      // At this point you should redirect the user to an authorization page.
      // This form will ask the user to approve the client and the scopes requested.

      // Once the user has approved or denied the client update the status
      // (true = approved, false = denied)
      authRequest.isAuthorizationApproved = true;

      // Return the HTTP redirect response
      const response = await this.oauth.completeAuthorizationRequest(authRequest);
      this.handleResponse(req, res, response);
      return;
    } catch (e) {
      this.handleError(e, res);
      return;
    }
  }

  @Post("/token")
  @HttpCode(HttpStatus.OK)
  async accessToken(@Req() req: Request, @Res() res: Response) {
    const request = new OAuthRequest(req);
    const response = new OAuthResponse(res);
    try {
      const tokenResponse = await this.oauth.respondToAccessTokenRequest(request, response);
      this.handleResponse(req, res, tokenResponse);
      return;
    } catch (e) {
      this.handleError(e, res);
      return;
    }
  }

  @Post("/token_info")
  async tokenInfo(@Req() req: Request, @Res() res: Response) {
    return res.status(400).send({ error: "message not "});
  }

  private handleResponse(req: Request, res: Response, response: OAuthResponse) {
    if (response.status === 302) {
      if (!response.headers.location) {
        throw new Error("missing redirect location"); // @todo this
      }
      res.set(response.headers);
      res.redirect(response.headers.location);
    } else {
      res.set(response.headers);
      res.status(response.status).send(response.body);
    }
  }

  private handleError(e: any, res: Response) {
    if (e instanceof OAuthException) {
      res.status(e.status);
      res.send({
        status: e.status,
        message: e.message,
      });
      return;
    }
    throw e;
  }
}
