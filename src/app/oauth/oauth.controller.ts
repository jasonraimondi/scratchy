import { Controller, HttpException, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import { Request, Response } from "express";

import { OAuthServerService } from "~/app/oauth/services/oauth_server.service";

@Controller("oauth2")
export class OAuthController {
  constructor(private readonly oauth: OAuthServerService) {}

  @Post("/access_token")
  async accessToken(@Req() req: Request, @Res() res: Response) {
    try {
      return await this.oauth.respondToAccessTokenRequest(req, res);
    } catch (e) {
      // @todo fix exception handling...
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(e.message, 500);
    }
  }
}
