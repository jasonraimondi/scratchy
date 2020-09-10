import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { AuthController } from "~/app/auth/auth.controller";
import { AuthService } from "~/app/auth/auth.service";
import { ForgotPasswordResolver } from "~/app/auth/resolvers/forgot_password.resolver";
import { LoginResolver } from "~/app/auth/resolvers/login.resolver";
import { LogoutResolver } from "~/app/auth/resolvers/logout.resolver";
import { JwtStrategy } from "~/app/auth/strategies/jwt.strategy";
import { ENV } from "~/config/environment";
import { EmailModule } from "~/lib/emails/email.module";
import { LoggerModule } from "~/lib/logger/logger.module";
import { RepositoryModule } from "~/lib/repositories/repository.module";

@Module({
  controllers: [AuthController],
  imports: [
    EmailModule,
    PassportModule,
    LoggerModule,
    RepositoryModule,
    JwtModule.register({
      secret: ENV.jwtSecret,
    }),
  ],
  providers: [AuthService, JwtStrategy, ForgotPasswordResolver, LogoutResolver, LoginResolver],
})
export class AuthModule {}
