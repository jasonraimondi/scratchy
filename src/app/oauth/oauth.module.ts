import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { grantProviders } from "~/app/oauth/grants/grant.providers";

import { repositoryProviders } from "~/app/oauth/repositories/repository.providers";
import { OAuthServerService } from "~/app/oauth/services/oauth_server.service";
import { AccessToken } from "~/app/oauth/entities/access_token.entity";
import { AuthorizationCode } from "~/app/oauth/entities/authorization_code.entity";
import { Client } from "~/app/oauth/entities/client.entity";
import { RefreshToken } from "~/app/oauth/entities/refresh_token.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
import { ENV } from "~/config/environment";
import { LoggerModule } from "~/lib/logger/logger.module";
import { RepositoryModule } from "~/lib/repositories/repository.module";
import { OAuthController } from "./oauth.controller";

@Module({
  controllers: [OAuthController],
  imports: [
    TypeOrmModule.forFeature([RefreshToken, AccessToken, AuthorizationCode, Client, Scope]),
    RepositoryModule,
    LoggerModule,
    JwtModule.register({
      secret: ENV.jwtSecret,
    }),
  ],
  providers: [...grantProviders, ...repositoryProviders, OAuthServerService],
})
export class OAuthModule {}
