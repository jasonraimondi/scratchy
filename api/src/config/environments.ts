import { join } from "path";
import ms from "ms";

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";
const isTesting = process.env.NODE_ENV === "test";

const required = ["URL", "DATABASE_URL", "JWT_SECRET"].filter((key) => !process.env.hasOwnProperty(key));

if (required.length > 0) {
  const message = `missing required envs: (${required.join(", ")})`;
  if (isTesting) {
    console.log(message);
  } else {
    throw new Error(message);
  }
}

const ENV = {
  env: process.env.NODE_ENV,
  isProduction,
  isDevelopment,
  isTesting,
  urls: {
    web: new URL(process.env.URL!),
    api: new URL(process.env.API_URL ?? process.env.URL!),
  },
  secrets: {
    salt: process.env.SALT,
    jwt: process.env.JWT_SECRET,
    cookie: process.env.COOKIE_SECRET,
  },
  enableDebugging: !!(process.env.ENABLE_DEBUGGING ?? isDevelopment),
  enablePlayground: !!(process.env.ENABLE_PLAYGROUND ?? isDevelopment),
  databaseURL: process.env.DATABASE_URL!,
  mailerURL: process.env.MAILER_URL,
  queueURL: process.env.QUEUE_URL,
  templatesDir: join(__dirname, "../../templates"),
  tokenTTLs: {
    accessToken: ms("10m"),
    refreshToken: ms("1d"),
    refreshTokenRememberMe: ms("30d"),
    forgotPasswordToken: ms("30m"),
    emailConfirmationToken: ms("30d"),
  },
  oauth: {
    google: {
      clientId: process.env.OAUTH_GOOGLE_ID,
      clientSecret: process.env.OAUTH_GOOGLE_SECRET,
      callbackURL: "https://scratchy.localdomain/api/oauth2/google/callback",
    },
    github: {
      clientId: process.env.OAUTH_GITHUB_ID,
      clientSecret: process.env.OAUTH_GITHUB_SECRET,
      callbackURL: "https://scratchy.localdomain/api/oauth2/github/callback",
    },
  },
  // aws: {
  //   host: process.env.AWS_S3_HOST!,
  //   bucket: process.env.AWS_S3_BUCKET!,
  //   accessKey: process.env.AWS_S3_ACCESS_KEY!,
  //   secretKey: process.env.AWS_S3_SECRET_KEY!,
  // },
};

export { ENV };
