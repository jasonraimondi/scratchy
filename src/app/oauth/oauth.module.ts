import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthCode } from "~/app/oauth/entities/auth_code.entity";
import { Client } from "~/app/oauth/entities/client.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { Token } from "~/app/oauth/entities/token.entity";
import { OAuthController } from "~/app/oauth/oauth.controller";
import { repositoryProviders } from "~/app/oauth/oauth.providers";
import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";
import { ENV } from "~/config/environment";
import { User } from "~/entity/user/user.entity";
import { LoggerModule } from "~/lib/logger/logger.module";
import { RepositoryModule } from "~/lib/repositories/repository.module";

@Module({
  controllers: [OAuthController],
  imports: [
    TypeOrmModule.forFeature([Token, AuthCode, Client, Scope, User]),
    RepositoryModule,
    LoggerModule,
    JwtModule.register({
      secret: ENV.jwtSecret,
    }),
  ],
  providers: [
    ...repositoryProviders,
    AuthorizationServer.register(),
  ],
})
export class OAuthModule {}
