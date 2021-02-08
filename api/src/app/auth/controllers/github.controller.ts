import { base64decode } from "@jmondi/oauth2-server";
import { Controller, Get, Injectable, Ip, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request, Response } from "express";

import { UnauthorizedException } from "~/app/user/exceptions/unauthorized.exception";
import { User } from "~/app/user/entities/user.entity";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";
import { AuthService } from "~/app/auth/services/auth.service";

@Injectable()
export class GithubAuthGuard extends AuthGuard("github") {}

@Controller("oauth2/github")
export class GithubController {
  constructor(private readonly userRepository: UserRepo, private readonly loginService: AuthService) {}

  @Get()
  @UseGuards(GithubAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async githubAuth() {}

  @Get("callback")
  @UseGuards(GithubAuthGuard)
  async githubAuthRedirect(@Req() req: Request, @Res() res: Response, @Ip() ipAddr: string) {
    let user: User | any = req.user;

    if (!user || !user.email) {
      throw UnauthorizedException.invalidUser();
    }

    if (user! instanceof User) {
      user = await this.userRepository.findByEmail(user.email);
    }

    // if (!req.cookies[COOKIES.redirectHelper]) {
    //   throw new InvalidRequestError("missing redirect_query_string");
    // }
    //
    // const redirectQueryString = base64decode(req.cookies[COOKIES.redirectHelper]);

    // await this.loginService.loginAndRedirect(user, ipAddr, res);
  }
}