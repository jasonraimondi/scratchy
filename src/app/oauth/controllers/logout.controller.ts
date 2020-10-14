import { Controller, Get, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";

@Controller("logout")
export class LogoutController {
  constructor(private readonly oauth: AuthorizationServer) {}

  @Get()
  async get(@Req() req: Request, @Res() res: Response) {
    res.cookie("jwt", false, this.oauth.cookieOptions());
    res.redirect("/");
  }
}
