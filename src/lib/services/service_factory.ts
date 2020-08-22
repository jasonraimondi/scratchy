import { IMailer } from "~/lib/services/email/mailer";
import { NodemailerService } from "~/lib/services/email/nodemailer_mailer";

export class ServiceFactory {
  constructor(private readonly mailerURL: string) {}

  get emailService(): IMailer {
    return new NodemailerService(this.mailerURL);
  }
}
