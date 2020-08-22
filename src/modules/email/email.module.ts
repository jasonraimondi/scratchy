import { Module } from "@nestjs/common";

import { RegisterEmail } from "~/modules/email/user/register.email";
import { ForgotPasswordEmail } from "~/modules/email/user/forgot_password.email";


const emails = [
  RegisterEmail,
  ForgotPasswordEmail,
]

@Module({
  providers: [...emails],
  exports: [...emails],
})
export class EmailModule {}
