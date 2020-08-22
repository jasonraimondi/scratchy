import Mail from "nodemailer/lib/mailer";

export type Options = Mail.Options;

export interface IMailer {
  send(options: Options): Promise<any>;
}
