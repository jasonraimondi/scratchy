import {
  AuthorizationServer as JmondiAuthorizationServer,
  AuthorizationServerOptions,
  DateInterval,
} from "@jmondi/oauth2-server";
import type { CookieSerializeOptions } from "fastify-cookie";

import { AuthCodeRepository } from "~/app/oauth/repositories/auth_code.repository";
import { ClientRepository } from "~/app/oauth/repositories/client.repository";
import { TokenRepository } from "~/app/oauth/repositories/token.repository";
import { ScopeRepository } from "~/app/oauth/repositories/scope.repository";
import { UserRepository } from "~/app/oauth/repositories/user.repository";
import { ENV } from "~/config/environments";
import { MyJwtService } from "~/lib/jwt/jwt.service";

type CustomCookieOptions = { cookieTTL?: DateInterval } & CookieSerializeOptions;

export class AuthorizationServer extends JmondiAuthorizationServer {
  cookieOptions({ cookieTTL, ...extraParams }: CustomCookieOptions = {}): CookieSerializeOptions {
    return {
      domain: ENV.urls.web!.hostname,
      httpOnly: true,
      sameSite: "strict",
      ...(cookieTTL ? { expires: cookieTTL?.getEndDate() } : {}),
      ...extraParams,
    };
  }

  static register(options?: AuthorizationServerOptions) {
    return {
      provide: AuthorizationServer,
      useFactory: (
        authCodeRepo: AuthCodeRepository,
        clientRepo: ClientRepository,
        tokenRepo: TokenRepository,
        scopeRepo: ScopeRepository,
        userRepo: UserRepository,
        jwt: MyJwtService,
      ) => new AuthorizationServer(authCodeRepo, clientRepo, tokenRepo, scopeRepo, userRepo, jwt, options),
      inject: [AuthCodeRepository, ClientRepository, TokenRepository, ScopeRepository, UserRepository, MyJwtService],
    };
  }
}
