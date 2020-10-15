import { OAuthRequest, OAuthResponse } from "@jmondi/oauth2-server";
import { Controller, HttpCode, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";

@Controller("oauth2/token")
export class TokenController {
  constructor(private readonly oauth: AuthorizationServer) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async post(@Req() req: Request, @Res() res: Response) {
    const request = new OAuthRequest(req);
    const response = new OAuthResponse(res);

    try {
      const tokenResponse = await this.oauth.respondToAccessTokenRequest(request, response);
      res.set(tokenResponse.headers);
      res.status(tokenResponse.status).send(tokenResponse.body);
      return;
    } catch (e) {
      this.oauth.handleError(e, res);
      return;
    }
  }
}
