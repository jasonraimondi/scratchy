import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { injectable } from "inversify";

import { IMailer, Options } from "~/lib/services/email/mailer";
import { ENV } from "~/lib/constants/config";

@injectable()
export class NodemailerService implements IMailer {
  private readonly transporter: Mail;

  constructor(mailerURL: string) {
    this.transporter = nodemailer.createTransport(mailerURL);
  }

  async send(options: Options) {
    return await this.transporter.sendMail(options).catch((e) => {
      if (ENV.enableDebugging && e.message.includes("ECONNREFUSED")) {
        console.log(options);
      }
      throw new Error(`error sending email: (${e.message})`);
    });
  }
}
