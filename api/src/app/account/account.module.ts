import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { EmailConfirmationService } from "~/app/account/services/email_confirmation.service";
import { ForgotPasswordService } from "~/app/account/services/forgot_password.service";
import { RegisterResolver } from "~/app/account/resolvers/register.resolver";
import { EmailModule } from "~/app/emails/email.module";
import { LoggerModule } from "~/lib/logger/logger.module";
import { DatabaseModule } from "~/lib/database/database.module";
import { ForgotPasswordResolver } from "~/app/account/resolvers/forgot_password.resolver";
import { EmailConfirmationResolver } from "~/app/account/resolvers/email_confirmation.resolver";
import { AuthService } from "~/app/auth/services/auth.service";
import { JwtModule } from "~/lib/jwt/jwt.module";

@Module({
  imports: [JwtModule, EmailModule, PassportModule, LoggerModule, DatabaseModule],
  providers: [
    ForgotPasswordService,
    EmailConfirmationService,
    ForgotPasswordResolver,
    EmailConfirmationResolver,
    RegisterResolver,
    AuthService,
  ],
})
export class AccountModule {}
