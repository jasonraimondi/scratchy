import { DateInterval } from "@jmondi/oauth2-server";
import { join } from "path";

const required = ["JWT_SECRET", "DOMAIN"].filter((key) => !process.env.hasOwnProperty(key));

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
  databaseURL: process.env.DATABASE_URL!,
  mailerURL: process.env.MAILER_URL,
  queueURL: process.env.QUEUE_URL,
  baseURL: process.env.BASE_URL,
  corsURLS: (process.env.CORS_URLS ?? "").split(","),
  templatesDir: join(__dirname, "../../templates"),
  loginDuration: new DateInterval("1h"),
  authCodeDuration: new DateInterval("10m"),
  accessTokenDuration: new DateInterval("1h"),
  refreshTokenDuration: new DateInterval("30d"),
};
