import { Module } from "@nestjs/common";

import { EmailConfirmationResolver } from "~/app/user/email_confirmation/email_confirmation.resolver";
import { EmailConfirmationService } from "~/app/user/email_confirmation/email_confirmation.service";
import { DatabaseModule } from "~/lib/database/database.module";
import { LoggerModule } from "~/lib/logger/logger.module";
import { AuthModule } from "~/app/auth/auth.module";

@Module({
  imports: [AuthModule, DatabaseModule, LoggerModule],
  providers: [EmailConfirmationResolver, EmailConfirmationService],
})
export class EmailConfirmationModule {}
