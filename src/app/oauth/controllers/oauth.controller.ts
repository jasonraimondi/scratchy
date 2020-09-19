import { Controller, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import OAuth2Server from "oauth2-server";
import { OAuthServerService } from "~/app/oauth/services/oauth_server.service";

@Controller("entities")
export class OauthController {
  constructor(private readonly oauth: OAuthServerService) {
  }

  @Post("/authenticate")
  async authenticate(@Req() req: Request, @Res() res: Response) {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    return this.oauth.authenticate(request, response);
  }

  @Post("/token")
  async token(@Req() req: Request, @Res() res: Response) {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    try {
      const foo = await this.oauth.token(request, response);
      console.log({ foo });
      return foo;
    } catch (e) {
      console.log(e);
    }
    throw new Error("Hi ya jason");
  }

  @Post("/authorize")
  async authorize(@Req() req: Request, @Res() res: Response) {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    return await this.oauth.authorize(request, response);
  }
}
