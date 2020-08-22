import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

import { EmailConfirmation } from "~/entity/user/email_confirmation_entity";
import { API_ROUTES } from "~/lib/services/route_service";

@Injectable()
export class RegisterEmail {
  constructor(private readonly mailerService: MailerService) {}

  async send(userConfirmation: EmailConfirmation): Promise<any> {
    const user = userConfirmation.user;
    const url = API_ROUTES.verify_email.create({
      email: user.email,
      id: userConfirmation.id,
    });
    const html = `<div>
  <p>Verify user email</p>
  <a href="${url}">${url}</a>
</div>`;

    await this.mailerService.sendMail({
      to: user.email,
      from: "noreply@example.com",
      subject: "Register User Email",
      text: url,
      html,
    });
  }
}
