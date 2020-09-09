import { ISendMailOptions } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";

import { EmailConfirmationToken } from "~/entity/user/email_confirmation.entity";
import { EmailService } from "~/lib/emails/services/email.service";
import { API_ROUTES } from "~/lib/routes/route.service";

interface IEmailService {
  send(context: any): Promise<void>;
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
        user,
        url: API_ROUTES.verify_email.create({
          email: user.email,
          id: userConfirmation.id,
        }),
      },
    };
    await this.emailService.send(data);
  }
}
