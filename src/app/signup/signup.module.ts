import { Module } from "@nestjs/common";
import { EmailConfirmationResolver } from "~/app/signup/resolvers/email_confirmation.resolver";
import { RegisterResolver } from "~/app/signup/resolvers/register.resolver";

import { EmailModule } from "~/lib/emails/email.module";
import { LoggerModule } from "~/lib/logger/logger.module";
import { RepositoryModule } from "~/lib/repositories/repository.module";

@Module({
  imports: [EmailModule, RepositoryModule, LoggerModule],
  providers: [EmailConfirmationResolver, RegisterResolver],
})
export class SignupModule {}
