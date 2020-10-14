import { MiddlewareConsumer, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import csurf from "csurf";

import { HelpController } from "~/app/oauth/controllers/_help.controller";
import { AuthorizeController } from "~/app/oauth/controllers/authorize.controller";
import { LoginController } from "~/app/oauth/controllers/login.controller";
import { LogoutController } from "~/app/oauth/controllers/logout.controller";
import { ScopesController } from "~/app/oauth/controllers/scopes.controller";
import { TokenController } from "~/app/oauth/controllers/token.controller";
import { AuthCode } from "~/app/oauth/entities/auth_code.entity";
import { Client } from "~/app/oauth/entities/client.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { Token } from "~/app/oauth/entities/token.entity";
import { repositoryProviders } from "~/app/oauth/oauth.providers";
import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";
import { MyJwtService } from "~/app/oauth/services/jwt.service";
import { ENV } from "~/config/environment";
import { User } from "~/entity/user/user.entity";
import { LoggerModule } from "~/lib/logger/logger.module";
import { RepositoryModule } from "~/lib/repositories/repository.module";

@Module({
  controllers: [
    HelpController,
    AuthorizeController,
    LoginController,
    LogoutController,
    ScopesController,
    TokenController,
  ],
  imports: [
    TypeOrmModule.forFeature([Token, AuthCode, Client, Scope, User]),
    RepositoryModule,
    LoggerModule,
    JwtModule.register({
      secret: ENV.jwtSecret,
    }),
  ],
  providers: [...repositoryProviders, AuthorizationServer.register(), MyJwtService],
})
export class OAuthModule {
  constructor(private readonly oauth: AuthorizationServer) {
    // this.oauth.enableGrantType("client_credentials");
    this.oauth.enableGrantType("authorization_code");
    this.oauth.enableGrantType("refresh_token");
  }

  configure(consumer: MiddlewareConsumer) {
    const middlewares = [csurf({ cookie: { httpOnly: true } })];
    consumer.apply(...middlewares).forRoutes(LoginController, ScopesController);
  }
}
