import { ISendMailOptions } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

import { EmailConfirmationToken } from "~/entities/email_confirmation.entity";
import { EmailService } from "~/lib/email/services/email.service";
import { WEB_ROUTES } from "~/config/routes";
import { LoggerService } from "~/lib/logger/logger.service";

export interface IEmailService {
  send(context: any): Promise<void>;
}

@Injectable()
export class RegisterEmail implements IEmailService {
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
    this.logger.debug(data.context?.url);
    await this.emailService.send(data);
  }
}
