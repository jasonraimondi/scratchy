import { Controller, Get, Req, Res } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";

import { ProviderController } from "~/app/auth/controllers/_base.controller";
import { GithubUserResponse } from "~/app/auth/controllers/github.controller";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { PrismaService } from "~/lib/database/prisma.service";
import { HttpService } from "@nestjs/axios";
import { AuthService } from "~/app/auth/services/auth.service";
import { FastifyOAuthClientService } from "~/app/auth/services/fastify_oauth.service";

@Controller("oauth2/google")
export class GoogleController extends ProviderController<GithubUserResponse> {
  protected readonly provider = "google";
  protected readonly profileUrl = "https://www.googleapis.com/oauth2/v2/userinfo";

  constructor(
    userRepository: UserRepository,
    prisma: PrismaService,
    httpService: HttpService,
    authService: AuthService,
    oauthService: FastifyOAuthClientService
  ) {
    super(userRepository, prisma, httpService, authService, oauthService);
  }

  @Get("callback")
  github(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    return this.handleOAuthLogin(req, res);
  }

  protected async profile(user: any) {
    console.log("SEARCH AND FIX THIS", user)
    return {
      // this is unknown
      id: user.id,
      email: user.email,
    };
  }
}
