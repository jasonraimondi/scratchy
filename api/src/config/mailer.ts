import { EnvSchema } from "~/config/environments/base";

export default {
  from: process.env.MAILER_FROM as string,
  host: process.env.MAILER_SMTP_URL as string,
} as EnvSchema["mailer"];
