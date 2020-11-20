import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import csurf from "csurf";

import { AuthorizeController } from "~/app/oauth/controllers/authorize.controller";
import { LoginController } from "~/app/oauth/controllers/login.controller";
import { LogoutController } from "~/app/oauth/controllers/logout.controller";
import { GithubController } from "~/app/oauth/controllers/providers/github.controller";
import { GoogleController } from "~/app/oauth/controllers/providers/google.controller";
import { ScopesController } from "~/app/oauth/controllers/scopes.controller";
import { TokenController } from "~/app/oauth/controllers/token.controller";
import { AuthCode } from "~/app/oauth/entities/auth_code.entity";
import { Client } from "~/app/oauth/entities/client.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { Token } from "~/app/oauth/entities/token.entity";
import { repositories, strategies } from "~/app/oauth/oauth.providers";
import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";
import { LoginService } from "~/app/oauth/services/login.service";
import { User } from "~/app/user/entities/user.entity";
import { LoggerModule } from "~/app/logger/logger.module";
import { DatabaseModule } from "~/app/database/database.module";
import { JwtModule } from "~/app/jwt/jwt.module";

@Module({
  controllers: [
    AuthorizeController,
    LoginController,
    LogoutController,
    ScopesController,
    TokenController,
    GoogleController,
    GithubController,
  ],
  imports: [TypeOrmModule.forFeature([Token, AuthCode, Client, Scope, User]), DatabaseModule, LoggerModule, JwtModule],
  providers: [...strategies, ...repositories, LoginService, AuthorizationServer.register()],
})
export class OAuthModule {
  constructor(private readonly oauth: AuthorizationServer) {
    this.oauth.enableGrantType("client_credentials");
    this.oauth.enableGrantType("authorization_code");
    this.oauth.enableGrantType("refresh_token");
  }

  configure(consumer: MiddlewareConsumer) {
    const middlewares = [csurf({ cookie: { httpOnly: true } })];
    consumer.apply(...middlewares).forRoutes(LoginController, ScopesController);
  }
}
