import { join } from "path";

export const ENV = {
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  nodeEnv: process.env.NODE_ENV,
  cookieDomain: process.env.DOMAIN,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? "",
  enableDebugging: !!process.env.ENABLE_DEBUGGING,
  enableOutputSchema: !!process.env.ENABLE_OUTPUT_SCHEMA,
  corsURLS: (process.env.CORS_URLS ?? "").split(","),
  mailerURL: process.env.MAILER_URL ?? "smtp://localhost:1025",
  queueURL: process.env.QUEUE_URL ?? "redis://localhost:6379",
  baseURL: process.env.BASE_URL ?? "http://localhost:8080",
  emailTemplatesDir: join(__dirname, "../../../templates/emails"),

};
