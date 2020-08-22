import { Module } from "@nestjs/common";

import { RepositoryModule } from "~/lib/repository/repository.module";
import { EmailModule } from "~/lib/email/email.module";
import { EmailConfirmationResolver } from "~/modules/signup/resolvers/email_confirmation_resolver";
import { RegisterResolver } from "~/modules/signup/resolvers/register_resolver";

@Module({
  imports: [EmailModule, RepositoryModule],
  providers: [EmailConfirmationResolver, RegisterResolver],
})
export class SignupModule {}
