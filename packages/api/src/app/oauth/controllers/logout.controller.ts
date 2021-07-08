import { Controller, Get, Res } from "@nestjs/common";
import type { FastifyReply } from "fastify";

import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";
import { COOKIES } from "~/config/cookies";

@Controller("logout")
export class LogoutController {
  constructor(private readonly oauth: AuthorizationServer) {}

  @Get()
  async get(@Res() res: FastifyReply) {
    res.cookie(COOKIES.token, "", this.oauth.cookieOptions({ expires: new Date(0) }));
    res.redirect("/");
  }
}
