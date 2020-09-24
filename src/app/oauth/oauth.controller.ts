import { OAuthException } from "@jmondi/oauth2-server";
import { HttpException, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";
import { UserRepo } from "~/lib/repositories/user/user.repository";
import { userGenerator } from "~test/generators/user.generator";

@Controller("oauth2")
export class OAuthController {
  constructor(private readonly oauth: AuthorizationServer, private readonly userRepository: UserRepo) {}

  @Get("/authorize")
  async authorize(@Req() req: Request, @Res() res: Response) {
    try {
      // Validate the HTTP request and return an AuthorizationRequest object.
      const authRequest = await this.oauth.validateAuthorizationRequest(req);

      // The auth request object can be serialized and saved into a user's session.
      // You will probably want to redirect the user at this point to a login endpoint.

      // Once the user has logged in set the user on the AuthorizationRequest
      console.log("this user needs to come from somewhere else");
      const user = await this.userRepository.create(await userGenerator());
      authRequest.user = user;

      // At this point you should redirect the user to an authorization page.
      // This form will ask the user to approve the client and the scopes requested.

      // Once the user has approved or denied the client update the status
      // (true = approved, false = denied)
      authRequest.isAuthorizationApproved = true;

      // Return the HTTP redirect response
      await this.oauth.completeAuthorizationRequest(authRequest, res);
    } catch (e) {
      this.handleError(e);
    }
  }

  @Post("/access_token")
  async accessToken(@Req() req: Request, @Res() res: Response) {
    try {
      return await this.oauth.respondToAccessTokenRequest(req, res);
    } catch (e) {
      this.handleError(e);
      return;
    }
  }

  @Post("/token_info")
  async tokenInfo(@Req() req: Request, @Res() res: Response) {
    return res.status(500).send("TODO");
  }

  private handleError(e: any) {
    // @todo clean up error handling
    if (e instanceof OAuthException) {
      throw new HttpException(e.message, e.status);
    } else if (e instanceof HttpException) {
      throw e;
    }
    throw new HttpException(e.message, 500);
  }
}
