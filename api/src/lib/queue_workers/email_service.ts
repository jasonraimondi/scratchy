import nodemailer, { SendMailOptions, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { Env } from "$config/env";
import { convert } from "html-to-text";

export type SendInput = SendMailOptions & {
  to: string | string[];
  subject: string;
  html: string;
};

class EmailService {
  private readonly transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport(Env.MAILER_SMTP_URL);
  }

  async send(input: SendInput) {
    return await this.transporter.sendMail({
      from: '"AllMyFutures" <noreply@scratchy.example.com>',
      text: convert(input.html),
      ...input,
    });
  }
}

export const emailService = new EmailService();
