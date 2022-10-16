import { Module, Provider } from "@nestjs/common";

import { PrismaService } from "~/lib/database/prisma.service";
import { EmailConfirmationRepository } from "~/lib/database/repositories/email_confirmation.repository";
import { ForgotPasswordRepository } from "~/lib/database/repositories/forgot_password.repository";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { LoggerModule } from "~/lib/logger/logger.module";

const databaseProviders: Provider[] = [
  PrismaService,
  UserRepository,
  EmailConfirmationRepository,
  ForgotPasswordRepository,
];

@Module({
  imports: [LoggerModule],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
