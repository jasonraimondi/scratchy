import { join } from "path";

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";
const isTesting = process.env.NODE_ENV === "test";

const required = ["URL", "DATABASE_URL", "JWT_SECRET"].filter((key) => !process.env.hasOwnProperty(key));

if (!isTesting && required.length > 0) {
  throw new Error(`missing required envs: (${required.join(", ")})`);
}

const ENV = {
  isProduction,
  isDevelopment,
  isTesting,
  url: new URL(process.env.URL!),
  apiUrl: new URL(process.env.API_URL!),
  secret: process.env.JWT_SECRET,
  enableDebugging: !!(process.env.ENABLE_DEBUGGING ?? isDevelopment),
  enablePlayground: !!(process.env.ENABLE_PLAYGROUND ?? isDevelopment),
  databaseURL: process.env.DATABASE_URL!,
  mailerURL: process.env.MAILER_URL,
  queueURL: process.env.QUEUE_URL,
  templatesDir: join(__dirname, "../../templates"),
  typeorm: {
    entities: join(__dirname, "../**/*.entity{.ts,.js}"),
    synchronize: !!process.env.TYPEORM_SYNCHRONIZE,
  },
  oauth: {
    google: {
      clientId: process.env.OAUTH_GOOGLE_ID,
      clientSecret: process.env.OAUTH_GOOGLE_SECRET,
      callbackURL: "http://api.scratchy.localdomain:8080/oauth2/google/callback",
    },
    github: {
      clientId: process.env.OAUTH_GITHUB_ID,
      clientSecret: process.env.OAUTH_GITHUB_SECRET,
      callbackURL: "http://api.scratchy.localdomain:8080/oauth2/github/callback",
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
