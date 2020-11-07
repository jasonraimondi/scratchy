import { base64decode } from "@jmondi/oauth2-server";
import { Controller, Get, Ip, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request, Response } from "express";
import { InvalidRequestError } from "oauth2-server";
import { OAuthUserRepo } from "~/app/oauth/repositories/oauth_user.repository";

import { LoginService } from "~/app/oauth/services/login.service";
import { UnauthorizedException } from "~/app/user/exceptions/unauthorized.exception";
import { User } from "~/app/user/entities/user.entity";
import { COOKIES } from "~/config/cookies";

@Controller("oauth2/google")
export class GoogleController {
  constructor(private readonly userRepository: OAuthUserRepo, private readonly loginService: LoginService) {}

  @Get()
  @UseGuards(AuthGuard("google"))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth() {}

  @Get("callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response, @Ip() ipAddr: string) {
    let user: any = req.user;

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
