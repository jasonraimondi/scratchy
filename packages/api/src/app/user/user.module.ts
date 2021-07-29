import { Module } from "@nestjs/common";

import { MeResolver } from "~/app/user/me.resolver";
import { UserResolver } from "~/app/user/user.resolver";
import { EmailConfirmationModule } from "~/app/user/email_confirmation/email_confirmation.module";
import { ForgotPasswordModule } from "~/app/user/forgot_password/forgot_password.module";
import { UpdatePasswordModule } from "~/app/user/update_password/update_password.module";
import { RegisterModule } from "~/app/user/register/register.module";
import { DatabaseModule } from "~/lib/database/database.module";
import { HeartbeatChannel } from "~/app/user/heartbeat.channel";

@Module({
  imports: [DatabaseModule, EmailConfirmationModule, ForgotPasswordModule, RegisterModule, UpdatePasswordModule],
  providers: [MeResolver, UserResolver, HeartbeatChannel],
})
export class UserModule {}
