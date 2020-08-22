import { Module } from "@nestjs/common";

import { DatabaseModule } from "~/database/database.module";
import { UserResolver } from "~/modules/user/resolvers/user_resolver";
import { MeResolver } from "~/modules/user/resolvers/me_resolver";
import { ForgotPasswordResolver } from "~/modules/user/resolvers/forgot_password_resolver";
import { EmailConfirmationResolver } from "~/modules/user/resolvers/email_confirmation_resolver";
import { RegisterResolver } from "~/modules/user/resolvers/register_resolver";
import { RegisterEmail } from "~/modules/user/emails/register.email";
import { ForgotPasswordEmail } from "~/modules/user/emails/forgot_password.email";

@Module({
  imports: [DatabaseModule],
  providers: [
    RegisterEmail,
    ForgotPasswordEmail,
    EmailConfirmationResolver,
    RegisterResolver,
    ForgotPasswordResolver,
    MeResolver,
    UserResolver,
  ],
})
export class UserModule {}
