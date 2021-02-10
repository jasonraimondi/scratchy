import { Module } from "@nestjs/common";

import { AuthService } from "~/app/auth/services/auth.service";
import { DatabaseModule } from "~/app/database/database.module";
import { AuthResolver } from "~/app/auth/auth.resolver";
import { JwtModule } from "~/lib/jwt/jwt.module";
import { GithubStrategy } from "~/app/auth/strategies/github.strategy";
import { GoogleStrategy } from "~/app/auth/strategies/google.strategy";
import { JwtStrategy } from "~/app/auth/strategies/jwt.strategy";
import { LoggerModule } from "~/lib/logger/logger.module";
import { GithubController } from "./controllers/github.controller";
import { GoogleController } from "./controllers/google.controller";

const strategies = [GithubStrategy, GoogleStrategy, JwtStrategy];

@Module({
  imports: [DatabaseModule, JwtModule, LoggerModule],
  providers: [AuthService, AuthResolver, ...strategies],
  controllers: [GithubController, GoogleController],
})
export class AuthModule {}
