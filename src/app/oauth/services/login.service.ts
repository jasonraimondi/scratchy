import { HttpStatus, Injectable } from "@nestjs/common";
import type { Response } from "express";

import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { OAuthUserRepo } from "~/app/oauth/repositories/oauth_user.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";
import { ENV } from "~/config/configuration";
import { User } from "~/app/user/entities/user.entity";
import { API_ROUTES } from "~/config/routes";
import { MyJwtService } from "~/app/jwt/jwt.service";
import { DateInterval } from "@jmondi/oauth2-server";
import { COOKIES } from "~/config/cookies";

@Injectable()
export class LoginService {
  constructor(
    private readonly clientRepo: ClientRepo,
    private readonly scopeRepo: ScopeRepo,
    private readonly userRepository: OAuthUserRepo,
    private readonly oauth: AuthorizationServer,
    private readonly jwt: MyJwtService,
  ) {}

  async loginAndRedirect(user: User, ipAddr: string, res: Response, query: string) {
    await this.userRepository.incrementLastLogin(user, ipAddr);

    const jwt = await this.jwt.sign({
      userId: user.id,
      email: user.email,
    });

    const cookieTTL = new DateInterval(ENV.oauth.authorizationServer.loginDuration);
    const options = this.oauth.cookieOptions({ cookieTTL });

    res.cookie(COOKIES.token, jwt, options);
    res.status(HttpStatus.FOUND);
    res.redirect(API_ROUTES.authorize.template + "?" + query);
  }
}
