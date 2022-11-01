import { Controller, Get, Req, Res } from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";
import { AxiosService } from "nestjs-axios-promise";

import { ProviderController } from "~/app/auth/controllers/_base.controller";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { PrismaService } from "~/lib/database/prisma.service";
import { AuthService } from "~/app/auth/services/auth.service";
import { OAuthClientService } from "~/app/auth/services/oauth_client.service";
import { Octokit } from "octokit";

@Controller("/oauth2/github")
export class GithubController extends ProviderController<GithubUserResponse> {
  protected readonly provider = "github";
  protected readonly profileUrl = "https://api.github.com/user";

  constructor(
    userRepository: UserRepository,
    prisma: PrismaService,
    httpService: AxiosService,
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
    const email = user.email ?? (token && (await this.fetchUserPrimaryEmail(token)));
    if (!email || email === "") {
      throw new Error("You need to set a public email in GitHub to use this OAuth Provider.");
    }
    return { id: user.node_id, email };
  }

  protected headers(accessToken: string) {
    return {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    };
  }

  private async fetchUserPrimaryEmail(accessToken: string): Promise<string | undefined> {
    const octokit = new Octokit({ auth: accessToken });

    const {
      viewer: { email, login },
    } = await octokit.graphql<{ viewer: { email?: string; login?: string } }>(`{
    viewer {
        email, login
      }
    }`);

    console.log(login, email);

    return email;
  }
}

// type GithubEmailResponse = GithubEmail[];

// type GithubEmail = {
//   email: string;
//   primary: boolean;
//   verified: boolean;
//   visibility: string;
// };

export interface GithubUserResponse {
  login: string;
  id: number;
  node_id: string;
  name: string;
  email?: string;
  avatar_url: string;
}
