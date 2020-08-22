import { Injectable, Logger } from "@nestjs/common";
import { ISendMailOptions } from "@nestjs-modules/mailer";

import { EmailConfirmationToken } from "~/entity/user/email_confirmation_entity";
import { API_ROUTES } from "~/lib/services/route";
import { EmailService } from "~/modules/email/services/email.service";

interface IEmailService {
  send<T>(context: any): Promise<void>;
}

@Injectable()
export class RegisterEmail implements IEmailService {
  private readonly logger = new Logger(RegisterEmail.name);

  constructor(private readonly emailService: EmailService) {}

  async send(userConfirmation: EmailConfirmationToken): Promise<void> {
    const user = userConfirmation.user;
    const data: ISendMailOptions = {
      to: user.email,
      subject: "Register User Email",
      template: "signup/register",
      context: {
        url: API_ROUTES.verify_email.create({
          email: user.email,
          id: userConfirmation.id,
        }),
      },
    };
    await this.emailService.send(data);
  }
}
