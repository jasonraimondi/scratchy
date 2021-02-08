import { base64decode } from "@jmondi/oauth2-server";
import { Controller, Get, Injectable, Ip, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request, Response } from "express";

import { UnauthorizedException } from "~/app/user/exceptions/unauthorized.exception";
import { User } from "~/app/user/entities/user.entity";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";

@Injectable()
export class GoogleAuthGuard extends AuthGuard("google") {}

@Controller("oauth2/google")
export class GoogleController {
  constructor(private readonly userRepository: UserRepo) {}

  @Get()
  @UseGuards(GoogleAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth() {}

  @Get("callback")
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response, @Ip() ipAddr: string) {
    let user: any = req.user;

    if (!user || !user.email) {
      throw UnauthorizedException.invalidUser();
    }

    if (user! instanceof User) {
      user = await this.userRepository.findByEmail(user.email);
    }

    // await this.loginService.loginAndRedirect(user, ipAddr, res);
  }
}