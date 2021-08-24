import type { FastifyReply, FastifyRequest } from "fastify";
import { Controller, Get, Ip, Req, Res } from "@nestjs/common";
import { base64urlencode } from "@jmondi/oauth2-server";

import { User } from "~/entities/user.entity";
import { UnauthorizedException } from "~/lib/exceptions/unauthorized.exception";
import { WEB_ROUTES } from "~/config";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { HttpService } from "@nestjs/axios";
import { AuthService } from "~/app/auth/services/auth.service";
import { FastifyOAuthClientService } from "~/app/auth/services/fastify_oauth.service";

@Controller("oauth2/github")
export class GithubController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
    private readonly oauthService: FastifyOAuthClientService,
  ) {}

  @Get("callback")
  async github(@Req() req: FastifyRequest, @Res() res: FastifyReply, @Ip() ipAddr: string) {
    let user: User;
    const { access_token } = await this.oauthService.github.getAccessTokenFromAuthorizationCodeFlow(req);
    const githubUser = await this.fetchGithubUser(access_token);
    if (!githubUser.email) throw new UnauthorizedException("no email was found from github");
    try {
      user = await this.userRepository.findByEmail(githubUser.email);
      if (!user.oauthGithubIdentifier) {
        user.oauthGithubIdentifier = githubUser.node_id;
        await this.userRepository.update(user);
      }
    } catch (e) {
      user = await User.create({ email: githubUser.email, createdIP: req.ip });
      user.isEmailConfirmed = true;
      user.oauthGithubIdentifier = githubUser.node_id;
      await this.userRepository.create(user);
    }
    const token = await this.authService.login({ user, res, ipAddr, rememberMe: false });
    const encodedToken = base64urlencode(JSON.stringify(token));
    return res.status(302).redirect(WEB_ROUTES.oauth_callback.create({ encodedToken }));
  }

  private async fetchGithubUser(accessToken: string): Promise<GithubUserResponse> {
    const headers = this.headers(accessToken);
    const response = await this.httpService
      .get<GithubUserResponse>("https://api.github.com/user", { headers })
      .toPromise();
    if (!response?.data) throw new Error("user not found");
    const user = response.data;
    if (!user.email) user.email = await this.fetchUserPrimaryEmail(accessToken);
    return user;
  }

  private async fetchUserPrimaryEmail(accessToken: string): Promise<string> {
    const headers = this.headers(accessToken);
    const response = await this.httpService
      .get<GithubEmailResponse>("https://api.github.com/user/emails", { headers })
      .toPromise();
    const primaryEmail = response?.data.filter((e) => e.primary)[0];
    if (!primaryEmail) throw new Error("email not provided from github");
    return primaryEmail.email;
  }

  private headers(accessToken: string) {
    return {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
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
}
