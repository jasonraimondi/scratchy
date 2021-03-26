import { ISendMailOptions } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

import { ForgotPasswordToken } from "~/app/account/entities/forgot_password.entity";
import { EmailService } from "~/app/emails/services/email.service";
import { WEB_ROUTES } from "~/config/routes";

@Injectable()
export class ForgotPasswordEmail {
  constructor(private readonly emailService: EmailService) {}

  async send(forgotPassword: ForgotPasswordToken): Promise<void> {
    const { id, user } = forgotPassword;
    const data: ISendMailOptions = {
      to: user.email,
      subject: "Forgot your password?",
      template: "auth/forgot_password",
      context: {
        url: WEB_ROUTES.forgot_password.create({ email: user.email, id }),
      },
    };
    await this.emailService.send(data);
  }
}
