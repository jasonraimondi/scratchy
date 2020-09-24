import { AuthCodeGrant, ClientCredentialsGrant } from "@jmondi/oauth2-server";
import { IGrant } from "@jmondi/oauth2-server";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { grantProviders, repositoryProviders } from "~/app/oauth/oauth.providers";

import { AuthorizationServer } from "~/app/oauth/services/authorization_server.service";
import { AccessToken } from "~/app/oauth/entities/access_token.entity";
import { AuthCode } from "~/app/oauth/entities/auth_code.entity";
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
    TypeOrmModule.forFeature([RefreshToken, AccessToken, AuthCode, Client, Scope]),
    RepositoryModule,
    LoggerModule,
    JwtModule.register({
      secret: ENV.jwtSecret,
    }),
  ],
  providers: [
    ...grantProviders,
    ...repositoryProviders,
    {
      provide: AuthorizationServer,
      useFactory: async (...grants: IGrant[]) => {
        const oauthServerService = new AuthorizationServer();
        grants.forEach((grant) => oauthServerService.enableGrantType(grant));
        return oauthServerService;
      },
      inject: [ClientCredentialsGrant, AuthCodeGrant],
    },
  ],
})
export class OAuthModule {}
