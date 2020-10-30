import { Controller, Get, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";

import { COOKIES } from "~/app/oauth/controllers/scopes.controller";
import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";

@Controller("logout")
export class LogoutController {
  constructor(private readonly oauth: AuthorizationServer) {}

  @Get()
  async get(@Req() req: Request, @Res() res: Response) {
    res.cookie(COOKIES.token, false, this.oauth.cookieOptions({ expires: new Date(0) }));
    res.redirect("/");
  }
}
