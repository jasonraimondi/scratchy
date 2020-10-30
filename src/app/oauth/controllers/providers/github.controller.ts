import { base64decode } from "@jmondi/oauth2-server";
import { Controller, Get, Ip, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request, Response } from "express";
import { InvalidRequestError } from "oauth2-server";
import { COOKIES } from "~/app/oauth/controllers/scopes.controller";
import { OAuthUserRepo } from "~/app/oauth/repositories/oauth_user.repository";

import { LoginService } from "~/app/oauth/services/login.service";
import { UnauthorizedException } from "~/entity/user/exceptions/unauthorized.exception";
import { User } from "~/entity/user/user.entity";

@Controller("oauth2/github")
export class GithubController {
  constructor(private readonly userRepository: OAuthUserRepo, private readonly loginService: LoginService) {}

  @Get()
  @UseGuards(AuthGuard("github"))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async githubAuth() {}

  @Get("callback")
  @UseGuards(AuthGuard("github"))
  async githubAuthRedirect(@Req() req: Request, @Res() res: Response, @Ip() ipAddr: string) {
    let user: User | any = req.user;

    if (!user || !user.email) {
      throw UnauthorizedException.invalidUser();
    }

    if (user! instanceof User) {
      user = await this.userRepository.findByEmail(user.email);
    }

    if (!req.cookies[COOKIES.redirectHelper]) {
      throw new InvalidRequestError("missing redirect_query_string");
    }

    const redirectQueryString = base64decode(req.cookies[COOKIES.redirectHelper]);

    await this.loginService.loginAndRedirect(user, ipAddr, res, redirectQueryString);
  }
}
