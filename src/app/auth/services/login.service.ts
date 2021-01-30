import { HttpStatus, Injectable } from "@nestjs/common";
import type { CookieOptions, Response } from "express";

import { ENV } from "~/config/configuration";
import { User } from "~/app/user/entities/user.entity";
import { API_ROUTES } from "~/config/routes";
import { MyJwtService } from "~/app/jwt/jwt.service";
import { DateInterval } from "@jmondi/oauth2-server";
import { COOKIES } from "~/config/cookies";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";

type CustomCookieOptions = { cookieTTL?: DateInterval } & CookieOptions;

@Injectable()
export class LoginService {
  constructor(
    private readonly userRepository: UserRepo,
    private readonly jwt: MyJwtService,
  ) {}

  async loginAndRedirect(user: User, ipAddr: string, res: Response) {
    await this.userRepository.incrementLastLogin(user, ipAddr);

    const jwt = await this.jwt.sign({
      userId: user.id,
      email: user.email,
    });

    const cookieTTL = new DateInterval(ENV.oauth.authorizationServer.loginDuration);
    const options = this.cookieOptions({ cookieTTL });

    res.cookie(COOKIES.token, jwt, options);
    res.status(HttpStatus.FOUND);
    res.redirect(API_ROUTES.authorize.template);
  }

  private get domain(): string {
    let domain = ENV.domain!;
    if (domain.includes(":")) domain = domain.split(":")[0];
    return domain;
  }

  private cookieOptions({ cookieTTL, ...extraParams }: CustomCookieOptions = {}): CookieOptions {
    return {
      domain: this.domain,
      httpOnly: true,
      sameSite: "strict",
      ...(cookieTTL ? { expires: cookieTTL?.getEndDate() } : {}),
      ...extraParams,
    };
  }
}