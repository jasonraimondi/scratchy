import { Controller, Get, Injectable, Ip, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { FastifyRequest, FastifyReply } from "fastify";
import querystring from "querystring";

import { UnauthorizedException } from "~/app/user/exceptions/unauthorized.exception";
import { User } from "~/entities/user.entity";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { AuthService } from "~/app/auth/services/auth.service";

@Injectable()
export class GithubAuthGuard extends AuthGuard("github") {}

@Controller("oauth2/github")
export class GithubController {
  constructor(private readonly userRepository: UserRepository, private readonly loginService: AuthService) {}

  @Get()
  @UseGuards(GithubAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async githubAuth() {}

  @Get("callback")
  @UseGuards(GithubAuthGuard)
  async githubAuthRedirect(@Req() req: FastifyRequest, @Res() res: FastifyReply, @Ip() ipAddr: string) {
    let user: User | any = req.user;
    if (!user || !user.email) {
      throw UnauthorizedException.invalidUser();
    }

    if (user! instanceof User) {
      user = await this.userRepository.findByEmail(user.email);
    }

    const token = await this.loginService.login({ user, res, rememberMe: true });

    res
      .status(302)
      .redirect(`https://scratchy.localdomain/callback?${querystring.stringify({ token: token.accessToken })}`);
  }
}
