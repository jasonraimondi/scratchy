import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { ForgotPasswordResolver } from "~/app/auth/resolvers/forgot_password.resolver";
import { LogoutResolver } from "~/app/auth/resolvers/logout.resolver";
import { ENV } from "~/config/environment";
import { EmailModule } from "~/lib/emails/email.module";
import { LoggerModule } from "~/lib/logger/logger.module";
import { RepositoryModule } from "~/lib/repositories/repository.module";

@Module({
  imports: [
    EmailModule,
    PassportModule,
    LoggerModule,
    RepositoryModule,
    JwtModule.register({
      secret: ENV.jwtSecret,
    }),
  ],
  providers: [ForgotPasswordResolver, LogoutResolver],
})
export class AuthModule {}
