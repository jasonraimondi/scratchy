import { Module, Provider } from "@nestjs/common";

import { PrismaService } from "~/lib/database/prisma.service";
import { EmailConfirmationRepo } from "~/lib/database/repositories/email_confirmation.repository";
import { ForgotPasswordRepo } from "~/lib/database/repositories/forgot_password.repository";
import { UserRepo } from "~/lib/database/repositories/user.repository";
import { LoggerModule } from "~/lib/logger/logger.module";

const databaseProviders: Provider[] = [PrismaService, UserRepo, EmailConfirmationRepo, ForgotPasswordRepo];

@Module({
  imports: [LoggerModule],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
