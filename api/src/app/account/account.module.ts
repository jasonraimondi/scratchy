import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { EmailConfirmationService } from "~/app/account/services/email_confirmation.service";
import { ForgotPasswordService } from "~/app/account/services/forgot_password.service";
import { RegisterResolver } from "~/app/account/resolvers/register.resolver";
import { EmailModule } from "~/app/emails/email.module";
import { LoggerModule } from "~/lib/logger/logger.module";
import { DatabaseModule } from "~/app/database/database.module";

@Module({
  imports: [EmailModule, PassportModule, LoggerModule, DatabaseModule],
  providers: [ForgotPasswordService, EmailConfirmationService, RegisterResolver],
})
export class AccountModule {}
