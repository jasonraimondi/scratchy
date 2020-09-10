import { join } from "path";

const required = ["JWT_SECRET", "MAILER_URL", "QUEUE_URL"].filter(key => !process.env.hasOwnProperty(key));

if (required.length > 0) {
  throw new Error(`missing required envs: (${required.join(", ")})`);
}

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";

export const ENV = {
  nodeEnv: process.env.NODE_ENV,
  isProduction,
  isDevelopment,
  domain: process.env.DOMAIN,
  jwtSecret: process.env.JWT_SECRET,
  enableDebugging: !!(process.env.ENABLE_DEBUGGING ?? isDevelopment),
  enablePlayground: !!(process.env.ENABLE_PLAYGROUND ?? isDevelopment),
  mailerURL: process.env.MAILER_URL,
  queueURL: process.env.QUEUE_URL,
  baseURL: process.env.BASE_URL,
  corsURLS: (process.env.CORS_URLS ?? "").split(","),
  emailTemplatesDir: join(__dirname, "../../templates/emails"),
};
