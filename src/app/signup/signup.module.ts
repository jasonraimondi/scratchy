import { Module } from "@nestjs/common";

import { RepositoryModule } from "../../../test/test_repository.module";
import { EmailModule } from "~/lib/emails/email.module";
import { EmailConfirmationResolver } from "~/app/signup/resolvers/email_confirmation_resolver";
import { RegisterResolver } from "~/app/signup/resolvers/register_resolver";

@Module({
  imports: [EmailModule, RepositoryModule],
  providers: [EmailConfirmationResolver, RegisterResolver],
})
export class SignupModule {}
