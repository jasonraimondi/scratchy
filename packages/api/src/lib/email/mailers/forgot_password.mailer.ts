import { ISendMailOptions } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

import { ForgotPasswordToken } from "~/entities/forgot_password.entity";
import { EmailService } from "~/lib/email/services/email.service";
import { WEB_ROUTES } from "~/config/routes";
import { IMailer } from "~/lib/email/mailers/mailer";
import { UserRepository } from "~/lib/database/repositories/user.repository";

@Injectable()
export class ForgotPasswordMailer implements IMailer {
  constructor(private readonly emailService: EmailService, private readonly userRepository: UserRepository) {}

  async send(forgotPassword: ForgotPasswordToken): Promise<void> {
    const { id, userId } = forgotPassword;
    const { email } = await this.userRepository.findById(userId);
    const data: ISendMailOptions = {
      to: email,
      subject: "Forgot your password?",
      template: "auth/forgot_password",
      context: {
        url: WEB_ROUTES.forgot_password.create({ email, id }),
      },
    };
    await this.emailService.send(data);
  }
}
