import { join } from "path";

export const ENV = {
  nodeEnv: process.env.NODE_ENV,
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  cookieDomain: process.env.DOMAIN,
  jwtSecret: process.env.JWT_SECRET ?? "",
  enableDebugging: !!process.env.ENABLE_DEBUGGING,
  enablePlayground: !!(process.env.ENABLE_PLAYGROUND ?? process.env.NODE_ENV === "development"),
  enableOutputSchema: !!process.env.ENABLE_OUTPUT_SCHEMA,
  corsURLS: (process.env.CORS_URLS ?? "").split(","),
  mailerURL: process.env.MAILER_URL,
  queueURL: process.env.QUEUE_URL,
  baseURL: process.env.BASE_URL ?? "localhost",
  emailTemplatesDir: join(__dirname, "../../templates/emails"),
};
