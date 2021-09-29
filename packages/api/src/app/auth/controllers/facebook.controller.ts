import { Controller, Get, Req, Res } from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";

import { ProviderController } from "~/app/auth/controllers/_base.controller";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { PrismaService } from "~/lib/database/prisma.service";
import { HttpService } from "@nestjs/axios";
import { AuthService } from "~/app/auth/services/auth.service";
import { OAuthClientService } from "~/app/auth/services/oauth_client.service";

@Controller("oauth2/facebook")
export class FacebookController extends ProviderController {
  protected readonly provider = "facebook";
  protected readonly profileUrl = `https://graph.facebook.com/me?fields=email,name,picture`;

  constructor(
    userRepository: UserRepository,
    prisma: PrismaService,
    httpService: HttpService,
    authService: AuthService,
    oauthService: OAuthClientService,
  ) {
    super(userRepository, prisma, httpService, authService, oauthService);
  }

  @Get("callback")
  github(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    return this.handleOAuthLogin(req, res);
  }

  protected async profile(user: any) {
    console.log("SEARCH AND FIX THIS", user);
    return {
      // this is unknown
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.picture.data.url,
    };
  }
}
