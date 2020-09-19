import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccessTokenRepo } from "~/app/oauth/repositories/access_token.repository";
import { AuthorizationCodeRepo } from "~/app/oauth/repositories/authorization_code.repository";
import { ClientRepo } from "~/app/oauth/repositories/client.repository";
import { RefreshTokenRepo } from "~/app/oauth/repositories/refresh_token.repository";
import { ScopeRepo } from "~/app/oauth/repositories/scope.repository";
import { OAuthServerService } from "~/app/oauth/services/oauth_server.service";
import { OAuthModelService } from "~/app/oauth/services/oauth_model.service";
import { AccessToken } from "~/app/oauth/entities/access_token.entity";
import { AuthorizationCode } from "~/app/oauth/entities/authorization_code.entity";
import { Client } from "~/app/oauth/entities/client.entity";
import { RefreshToken } from "~/app/oauth/entities/refresh_token.entity";
import { Scope } from "~/app/oauth/entities/scope.entity";
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
