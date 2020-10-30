import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { EmailConfirmationResolver } from "~/app/auth/resolvers/email_confirmation.resolver";

import { ForgotPasswordResolver } from "~/app/auth/resolvers/forgot_password.resolver";
import { LogoutResolver } from "~/app/auth/resolvers/logout.resolver";
import { RegisterResolver } from "~/app/auth/resolvers/register.resolver";
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
  providers: [ForgotPasswordResolver, LogoutResolver, EmailConfirmationResolver, RegisterResolver],
})
export class AuthModule {}
