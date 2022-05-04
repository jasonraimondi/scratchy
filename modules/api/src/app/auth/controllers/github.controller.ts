import { Controller, Get, Req, Res } from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";
import { firstValueFrom } from "rxjs";

import { ProviderController } from "~/app/auth/controllers/_base.controller";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { PrismaService } from "~/lib/database/prisma.service";
import { HttpService } from "@nestjs/axios";
import { AuthService } from "~/app/auth/services/auth.service";
import { OAuthClientService } from "~/app/auth/services/oauth_client.service";

@Controller("/api/oauth2/github")
export class GithubController extends ProviderController<GithubUserResponse> {
  protected readonly provider = "github";
  protected readonly profileUrl = "https://api.github.com/user";

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

  protected async profile(user: GithubUserResponse, token?: string) {
    return {
      id: user.node_id,
      email: user.email ?? (token && (await this.fetchUserPrimaryEmail(token))),
    };
  }

  protected headers(accessToken: string) {
    return {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    };
  }

  private async fetchUserPrimaryEmail(accessToken: string): Promise<string> {
    const headers = this.headers(accessToken);
    const response = await firstValueFrom(
      this.httpService.get<GithubEmailResponse>("https://api.github.com/user/emails", { headers }),
    );
    return response?.data.filter(e => e.primary)?.[0]?.email;
  }
}

type GithubEmailResponse = GithubEmail[];

type GithubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string;
};

export interface GithubUserResponse {
  login: string;
  id: number;
  node_id: string;
  name: string;
  email: string;
  avatar_url: string;
}
