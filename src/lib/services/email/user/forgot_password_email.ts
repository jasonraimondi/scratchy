import { inject, injectable } from "inversify";

import { IMailer } from "~/lib/services/email/mailer";
import { SERVICE } from "~/lib/constants/inversify";
import { ForgotPassword } from "~/entity/user/forgot_password_entity";
import { API_ROUTES } from "~/lib/services/route_service";

@injectable()
export class ForgotPasswordEmail {
  constructor(@inject(SERVICE.Mailer) private readonly mailer: IMailer) {}

  async send(forgotPassword: ForgotPassword): Promise<any> {
    const { id, user } = forgotPassword;
    const url = API_ROUTES.forgot_password.create({ email: user.email, id });
    const text = url;
    const html = `<div>
  <p>Forgot your password?</p>
  <p>I'll Help you find a new one ${id} ${user.email} ${forgotPassword.expiresAt}</p>
  <a href="${url}">${url}</a>
</div>`;

    await this.mailer.send({
      to: user.email,
      from: "noreply@example.com",
      subject: "Forgot your password?",
      text,
      html,
    });
  }
}
