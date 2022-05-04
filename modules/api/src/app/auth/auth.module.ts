import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";

import { AuthService } from "~/app/auth/services/auth.service";
import { AuthResolver } from "~/app/auth/resolvers/auth.resolver";
import { TokenService } from "~/app/auth/services/token.service";
import { OAuthClientService } from "~/app/auth/services/oauth_client.service";
import { FacebookController } from "~/app/auth/controllers/facebook.controller";
import { GithubController } from "~/app/auth/controllers/github.controller";
import { GoogleController } from "~/app/auth/controllers/google.controller";
import { DatabaseModule } from "~/lib/database/database.module";
import { JwtModule } from "~/lib/jwt/jwt.module";
import { LoggerModule } from "~/lib/logger/logger.module";

@Module({
  controllers: [FacebookController, GithubController, GoogleController],
  imports: [DatabaseModule, HttpModule, JwtModule, LoggerModule],
  providers: [AuthService, TokenService, OAuthClientService, AuthResolver],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
