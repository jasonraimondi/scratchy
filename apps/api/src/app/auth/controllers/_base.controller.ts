import { Provider } from "@lib/prisma";
import type { FastifyReply, FastifyRequest } from "fastify";
import { AxiosService } from "nestjs-axios-promise";

import { UserRepository } from "~/lib/database/repositories/user.repository";
import { PrismaService } from "~/lib/database/prisma.service";
import { AuthService } from "~/app/auth/services/auth.service";
import { OAuthClientService } from "~/app/auth/services/oauth_client.service";
import { User } from "~/entities/user.entity";
import { UnauthorizedException } from "~/lib/exceptions/unauthorized.exception";
import { WEB_ROUTES } from "~/config/urls";
import { UserProvider } from "~/entities/user_provider.entity";

type OAuthUser = {
  email: string;
  id: string;
  [key: string]: unknown;
};

function base64urlencode(str: string | Buffer) {
  return Buffer.from(str).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export abstract class ProviderController<T = any> {
  protected abstract readonly provider: Provider;
  protected abstract readonly profileUrl: string;
  protected abstract profile(user: T): Promise<OAuthUser>;

  protected constructor(
    protected readonly userRepository: UserRepository,
    protected readonly prisma: PrismaService,
    protected readonly httpService: AxiosService,
    protected readonly authService: AuthService,
    protected readonly oauthService: OAuthClientService,
  ) {}

  protected async handleOAuthLogin(req: FastifyRequest, res: FastifyReply) {
    let user: User;
    const tokenRes = await this.oauthService.fastify[this.provider].getAccessTokenFromAuthorizationCodeFlow(req);

    const oauthUser = await this.fetchProfileUser(tokenRes.token.access_token);

    if (!oauthUser.email) throw new UnauthorizedException(`email was not provided by ${this.provider}`);

    try {
      user = await this.userRepository.findByEmail(oauthUser.email, { providers: true });
    } catch (e) {
      user = await User.create({
        email: oauthUser.email,
        nickname: typeof oauthUser.nickname === "string" ? oauthUser.nickname : undefined,
        createdIP: req.ip,
      });
      user.isEmailConfirmed = true;
      await this.userRepository.create(user);
    }

    if (!user.providers?.find(p => p.provider === this.provider)) {
      const provider = new UserProvider({ userId: user.id, provider: this.provider });
      await this.prisma.userProvider.create({ data: provider.toPrisma() });
    }

    const token = await this.authService.login({ user, res, ipAddr: req.ip, rememberMe: false });
    const encodedToken = base64urlencode(JSON.stringify(token));
    return res.status(302).redirect(WEB_ROUTES.oauth_callback.create({ encodedToken }));
  }

  protected headers(accessToken: string): Record<string, string> {
    return {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
  }

  private async fetchProfileUser(accessToken: string): Promise<OAuthUser> {
    const headers = this.headers(accessToken);
    const { data } = await this.httpService.get<T>(this.profileUrl, { headers });
    if (!data) throw new Error("user not found");
    return this.profile(data);
  }
}
