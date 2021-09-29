import { ISendMailOptions } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

import { EmailConfirmationToken } from "~/entities/email_confirmation.entity";
import { EmailService } from "~/lib/email/services/email.service";
import { WEB_ROUTES } from "~/config/routes";
import { IMailer } from "~/lib/email/mailers/mailer";
import { UserRepository } from "~/lib/database/repositories/user.repository";

@Injectable()
export class RegisterMailer implements IMailer {
  constructor(private readonly emailService: EmailService, private readonly userRepository: UserRepository) {}

  async send(userConfirmation: EmailConfirmationToken): Promise<void> {
    const user = await this.userRepository.findById(userConfirmation.userId);
    const data: ISendMailOptions = {
      to: user.email,
      subject: "Register User Email",
      template: "auth/register",
      context: {
        user,
        url: WEB_ROUTES.verify_email.create({
          email: user.email,
          id: userConfirmation.id,
        }),
      },
    };
    await this.emailService.send(data);
  }
}
