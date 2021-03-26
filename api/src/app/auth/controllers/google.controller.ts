import { Controller, Get, Injectable, Ip, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { FastifyRequest, FastifyReply } from "fastify";

import { UnauthorizedException } from "~/app/user/exceptions/unauthorized.exception";
import { User } from "~/app/user/entities/user.entity";
import { UserRepo } from "~/lib/database/repositories/user.repository";

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
  async googleAuthRedirect(@Req() req: FastifyRequest, @Res() res: FastifyReply, @Ip() ipAddr: string) {
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
