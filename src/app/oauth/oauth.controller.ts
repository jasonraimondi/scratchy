import { Controller, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

import { OAuthServerService } from "~/app/oauth/services/oauth_server.service";

@Controller("oauth2")
export class OAuthController {
  constructor(private readonly oauth: OAuthServerService) {}

  @Post("/access_token")
  async accessToken(@Req() req: Request, @Res() res: Response) {
    return this.oauth.respondToAccessTokenRequest(req, res);
  }
}
