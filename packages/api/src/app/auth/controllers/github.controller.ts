import type { FastifyReply, FastifyRequest } from "fastify";
import { Controller, Get, Ip, Req, Res } from "@nestjs/common";

import { AbstractProviderController } from "~/app/auth/controllers/_abstract.controller";

@Controller("oauth2/github")
export class GithubController extends AbstractProviderController {
  @Get("callback")
  async githubAuthRedirect(@Req() req: FastifyRequest, @Res() res: FastifyReply, @Ip() ipAddr: string) {
    const { access_token } = await this.fastify.GitHub.getAccessTokenFromAuthorizationCodeFlow(req);
    const githubUser = await this.fetchGithubUser(access_token);
    const user = await this.userRepository.findByEmail(githubUser.email);
    const token = await this.authService.login({ user, res, ipAddr, rememberMe: false });
    return res.send(token);
  }

  private async fetchGithubUser(accessToken: string): Promise<GithubUserResponse> {
    const headers = this.headers(accessToken);
    const response = await this.httpService.get<GithubUserResponse>("https://api.github.com/user", { headers }).toPromise();
    if (!response?.data) throw new Error("user not found");
    const user = response.data;
    if (!user.email) user.email = await this.fetchUserPrimaryEmail(accessToken);
    return user;
  }

  private async fetchUserPrimaryEmail(accessToken: string): Promise<string> {
    const headers = this.headers(accessToken);
    const response = await this.httpService.get<GithubEmailResponse>("https://api.github.com/user/emails", { headers }).toPromise();
    const primaryEmail = response?.data.filter(e => e.primary)[0];
    if (!primaryEmail) throw new Error("email not provided from github");
    return primaryEmail.email;
  }

  private headers(accessToken: string) {
    return {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json"
    };
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
};