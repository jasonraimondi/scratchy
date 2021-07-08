import { Module } from "@nestjs/common";

import { DatabaseModule } from "~/lib/database/database.module";
import { LoggerModule } from "~/lib/logger/logger.module";

import { ForgotPasswordResolver } from "~/app/user/forgot_password/forgot_password.resolver";
import { ForgotPasswordService } from "~/app/user/forgot_password/forgot_password.service";
import { AuthModule } from "~/app/auth/auth.module";
import { EmailModule } from "~/lib/email/email.module";

@Module({
  imports: [AuthModule, DatabaseModule, EmailModule, LoggerModule],
  providers: [ForgotPasswordResolver, ForgotPasswordService],
})
export class ForgotPasswordModule {}
