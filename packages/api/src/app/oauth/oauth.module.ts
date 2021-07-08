import { Module } from "@nestjs/common";

import { LoginController } from "~/app/oauth/controllers/login.controller";
import { TokenController } from "~/app/oauth/controllers/token.controller";
import { DatabaseModule } from "~/lib/database/database.module";
import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";
import { LoggerModule } from "~/lib/logger/logger.module";
import { AuthorizeController } from "~/app/oauth/controllers/authorize.controller";
import { LogoutController } from "~/app/oauth/controllers/logout.controller";
import { ScopesController } from "~/app/oauth/controllers/scopes.controller";
import { LoginService } from "~/app/oauth/services/login.service";
import { JwtModule } from "~/lib/jwt/jwt.module";
import { ClientRepository } from "~/app/oauth/repositories/client.repository";
import { TokenRepository } from "~/app/oauth/repositories/token.repository";
import { AuthCodeRepository } from "~/app/oauth/repositories/auth_code.repository";
import { ScopeRepository } from "~/app/oauth/repositories/scope.repository";
import { UserRepository } from "~/app/oauth/repositories/user.repository";

@Module({
  controllers: [AuthorizeController, LoginController, LogoutController, ScopesController, TokenController],
  imports: [DatabaseModule, LoggerModule, JwtModule],
  providers: [
    ClientRepository,
    TokenRepository,
    AuthCodeRepository,
    ScopeRepository,
    UserRepository,
    LoginService,
    AuthorizationServer.register(),
  ],
})
export class OAuthModule {
  constructor(private readonly oauth: AuthorizationServer) {
    this.oauth.enableGrantType("client_credentials");
    this.oauth.enableGrantType("authorization_code");
    this.oauth.enableGrantType("refresh_token");
  }

  // configure(consumer: MiddlewareConsumer) {
  //   const csrf = require("fastify-csrf")({ cookie: { httpOnly: true } });
  //   const middlewares = [csrf];
  //   consumer.apply(...middlewares).forRoutes(LoginController, ScopesController);
  // }
}
