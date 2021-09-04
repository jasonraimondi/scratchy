import { HttpService } from "@nestjs/axios";
import { base64urlencode } from "@jmondi/oauth2-server";
import { Provider } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { firstValueFrom } from "rxjs";

import { UserRepository } from "~/lib/database/repositories/user.repository";
import { PrismaService } from "~/lib/database/prisma.service";
import { AuthService } from "~/app/auth/services/auth.service";
import { FastifyOAuthClientService } from "~/app/auth/services/fastify_oauth.service";
import { User } from "~/entities/user.entity";
import { UnauthorizedException } from "~/lib/exceptions/unauthorized.exception";
import { UserProvider } from "~/entities/user_provider";
import { WEB_ROUTES } from "~/config";

type OAuthUser = {
  email: string;
  id: string;
}

export abstract class ProviderController<T = any> {
  protected abstract readonly provider: Provider;
  protected abstract readonly profileUrl: string;
  protected abstract profile(user: T): Promise<OAuthUser>;

  protected constructor(
    protected readonly userRepository: UserRepository,
    protected readonly prisma: PrismaService,
    protected readonly httpService: HttpService,
    protected readonly authService: AuthService,
    protected readonly oauthService: FastifyOAuthClientService
  ) {
  }

  protected async handleOAuthLogin(req: FastifyRequest, res: FastifyReply) {
    let user: User;
    const tokenRes = await this.oauthService.fastify[this.provider].getAccessTokenFromAuthorizationCodeFlow(req);

    const oauthUser = await this.fetchProfileUser(tokenRes.access_token);

    if (!oauthUser.email) throw new UnauthorizedException(`email was not provided by ${this.provider}`);

    try {
      user = await this.userRepository.findByEmail(oauthUser.email, { include: { providers: true } });
    } catch (e) {
      user = await User.create({ email: oauthUser.email, createdIP: req.ip });
      user.isEmailConfirmed = true;
      await this.userRepository.create(user);
    }

    if (!user.getProvider(this.provider)) {
      const provider = new UserProvider({ id: oauthUser.id, userId: user.id, provider: this.provider });
      await this.prisma.userProvider.create({ data: provider.toEntity() });
    }

    const token = await this.authService.login({ user, res, ipAddr: req.ip, rememberMe: false });
    const encodedToken = base64urlencode(JSON.stringify(token));
    return res.status(302).redirect(WEB_ROUTES.oauth_callback.create({ encodedToken }));
  }

  protected headers(accessToken: string): Record<string, string> {
    return {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    };
  }

  private async fetchProfileUser(accessToken: string): Promise<OAuthUser> {
    const headers = this.headers(accessToken);
    const { data } = await firstValueFrom(this.httpService.get<T>(this.profileUrl, { headers }));
    if (!data) throw new Error("user not found");
    return this.profile(data);
  }
}