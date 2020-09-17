import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccessTokenRepo } from "~/app/oauth/repository/access_token.repository";
import { AuthorizationCodeRepo } from "~/app/oauth/repository/authorization_code.repository";
import { ClientRepo } from "~/app/oauth/repository/client.repository";
import { RefreshTokenRepo } from "~/app/oauth/repository/refresh_token.repository";
import { ScopeRepo } from "~/app/oauth/repository/scope.repository";
import { OAuthServerService } from "~/app/oauth/services/oauth_server.service";
import { OAuthModelService } from "~/app/oauth/services/oauth_model.service";
import { AccessToken } from "~/entity/oauth/access_token.entity";
import { AuthorizationCode } from "~/entity/oauth/authorization_code.entity";
import { Client } from "~/entity/oauth/client.entity";
import { RefreshToken } from "~/entity/oauth/refresh_token.entity";
import { Scope } from "~/entity/oauth/scope.entity";
import { LoggerModule } from "~/lib/logger/logger.module";
import { RepositoryModule } from "~/lib/repositories/repository.module";
import { OauthController } from "./controllers/oauth.controller";

@Module({
  controllers: [OauthController],
  imports: [
    TypeOrmModule.forFeature([RefreshToken, AccessToken, AuthorizationCode, Client, Scope]),
    RepositoryModule,
    LoggerModule,
  ],
  providers: [
    OAuthModelService,
    OAuthServerService.forFeature(),
    ClientRepo,
    AccessTokenRepo,
    RefreshTokenRepo,
    AuthorizationCodeRepo,
    ScopeRepo,
  ],
})
export class OauthModule {}
