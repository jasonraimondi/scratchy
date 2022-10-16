import { IsString } from "class-validator";

class MailerEnvironment {
  @IsString() from = process.env.MAILER_FROM as string;
  @IsString() host = process.env.MAILER_SMTP_URL as string;
}

export const MAILER = new MailerEnvironment();
