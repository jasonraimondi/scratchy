import { Injectable, Logger } from "@nestjs/common";
import { ISendMailOptions } from "@nestjs-modules/mailer";

import { ForgotPasswordToken } from "~/entity/user/forgot_password_entity";
import { EmailService } from "~/lib/emails/services/email.service";
import { API_ROUTES } from "~/lib/services/route";

@Injectable()
export class ForgotPasswordEmail {
  private readonly logger = new Logger(ForgotPasswordEmail.name);

  constructor(private readonly emailService: EmailService) {}

  async send(forgotPassword: ForgotPasswordToken): Promise<void> {
    const { id, user } = forgotPassword;
    const data: ISendMailOptions = {
      to: user.email,
      subject: "Forgot your password?",
      template: "auth/forgot_password",
      context: {
        url: API_ROUTES.forgot_password.create({ email: user.email, id }),
      },
    };
    await this.emailService.send(data);
  }
}
