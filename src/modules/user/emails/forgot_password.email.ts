import { MailerService } from "@nestjs-modules/mailer";

import { ForgotPasswordToken } from "~/entity/user/forgot_password_entity";
import { API_ROUTES } from "~/lib/services/route_service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ForgotPasswordEmail {
  constructor(private readonly mailerService: MailerService) {}

  async send(forgotPassword: ForgotPasswordToken): Promise<any> {
    const { id, user } = forgotPassword;
    const url = API_ROUTES.forgot_password.create({ email: user.email, id });
    const text = url;
    const html = `<div>
  <p>Forgot your password?</p>
  <p>I'll Help you find a new one ${id} ${user.email} ${forgotPassword.expiresAt}</p>
  <a href="${url}">${url}</a>
</div>`;

    await this.mailerService.sendMail({
      to: user.email,
      from: "noreply@example.com",
      subject: "Forgot your password?",
      text,
      html,
    });
  }
}
