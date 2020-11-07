import { DateInterval } from "@jmondi/oauth2-server";
import { join } from "path";

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";
const isTesting = process.env.NODE_ENV === "test";

const required = ["PROTOCOL", "DOMAIN", "DATABASE_URL", "JWT_SECRET"].filter((key) => !process.env.hasOwnProperty(key));

if (!isTesting && required.length > 0) {
  throw new Error(`missing required envs: (${required.join(", ")})`);
}

const protocol = process.env.PROTOCOL;
const domain = process.env.DOMAIN;

const ENV = {
  isProduction,
  protocol,
  domain: domain,
  url: `${protocol}://${domain}`,
  secret: process.env.JWT_SECRET,
  enableDebugging: !!(process.env.ENABLE_DEBUGGING ?? isDevelopment),
  enablePlayground: !!(process.env.ENABLE_PLAYGROUND ?? isDevelopment),
  databaseURL: process.env.DATABASE_URL!,
  mailerURL: process.env.MAILER_URL,
  queueURL: process.env.QUEUE_URL,
  corsURLS: (process.env.CORS_URLS ?? "").split(","),
  templatesDir: join(__dirname, "../../templates"),
  oauth: {
    authorizationServer: {
      loginDuration: "1h",
      authCodeDuration: "10m",
      accessTokenDuration: "1h",
      refreshTokenDuration: "30d",
    },
    google: {
      clientId: process.env.OAUTH_GOOGLE_ID,
      clientSecret: process.env.OAUTH_GOOGLE_SECRET,
    },
    github: {
      clientId: process.env.OAUTH_GITHUB_ID,
      clientSecret: process.env.OAUTH_GITHUB_SECRET,
    },
  },
};

if (isTesting) {
  ENV.protocol = "http";
  ENV.domain = "localhost";
  ENV.url = ENV.protocol + "://" + ENV.domain;
}

export { ENV };
