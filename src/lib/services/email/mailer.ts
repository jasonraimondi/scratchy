import Mail from "nodemailer/lib/mailer";

export interface Options extends Mail.Options {}

export interface IMailer {
  send(options: Options): Promise<any>;
}
