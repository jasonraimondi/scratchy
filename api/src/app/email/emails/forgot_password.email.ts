import { ISendMailOptions } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

import { ForgotPasswordToken } from "~/entities/forgot_password.entity";
import { EmailService } from "~/app/email/services/email.service";
import { WEB_ROUTES } from "~/config/routes";
import { IEmailService } from "~/app/email/emails/register.email";

@Injectable()
export class ForgotPasswordEmail implements IEmailService {
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
