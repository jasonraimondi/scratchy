import { Module } from "@nestjs/common";

import { EmailModule } from "~/lib/emails/email.module";
import { EmailConfirmationResolver } from "~/app/signup/resolvers/email_confirmation_resolver";
import { RegisterResolver } from "~/app/signup/resolvers/register_resolver";
import { RepositoryModule } from "~/lib/repositories/repository.module";

@Module({
  imports: [EmailModule, RepositoryModule],
  providers: [EmailConfirmationResolver, RegisterResolver],
})
export class SignupModule {}
