import { inject, injectable } from "inversify";

import { IMailer } from "~/lib/services/email/mailer";
import { SERVICE } from "~/lib/constants/inversify";
import { EmailConfirmation } from "~/entity/user/email_confirmation_entity";
import { API_ROUTES } from "~/lib/services/route_service";

@injectable()
export class RegisterEmail {
  constructor(@inject(SERVICE.Mailer) private readonly emailService: IMailer) {}

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

    await this.emailService.send({
      to: user.email,
      from: "noreply@example.com",
      subject: "Register User Email",
      text: url,
      html,
    });
  }
}
