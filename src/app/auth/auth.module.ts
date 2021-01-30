import { Module } from '@nestjs/common';

import { LocalStrategy } from "~/app/auth/strategies/local.strategy";
import { AuthService } from "~/app/auth/services/auth.service";
import { DatabaseModule } from "~/app/database/database.module";
import { AuthController } from './auth.controller';
import { JwtModule } from "~/app/jwt/jwt.module";
import { GithubController } from './github/github.controller';
import { GoogleController } from './google/google.controller';
import { LoginService } from './services/login.service';
import { GithubStrategy } from "~/app/auth/github/github.strategy";
import { GoogleStrategy } from "~/app/auth/google/google.strategy";
import { JwtStrategy } from "~/app/auth/strategies/jwt.strategy";

const strategies = [LocalStrategy, GithubStrategy, GoogleStrategy, JwtStrategy]

@Module({
  imports: [DatabaseModule, JwtModule],
  providers: [AuthService, LoginService, ...strategies],
  controllers: [AuthController, GithubController, GoogleController],
})
export class AuthModule {}
