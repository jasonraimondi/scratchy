import { ISendMailOptions } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

import { EmailConfirmationToken } from "~/entities/email_confirmation.entity";
import { EmailService } from "~/lib/email/services/email.service";
import { WEB_ROUTES } from "~/config/routes";
import { LoggerService } from "~/lib/logger/logger.service";
import { IMailer } from "~/lib/email/mailers/mailer";

@Injectable()
export class RegisterMailer implements IMailer {
  constructor(private readonly emailService: EmailService, private logger: LoggerService) {
    this.logger.setContext(this.constructor.name);
  }

  async send(userConfirmation: EmailConfirmationToken): Promise<void> {
    const user = userConfirmation.user;
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
