import { join } from "path";
import ms from "ms";
import { IsIn, IsUrl } from "class-validator";


const ENV = {
  secrets: {
    jwt: process.env.JWT_SECRET!,
    cookie: process.env.COOKIE_SECRET!,
    otp: process.env.OTP_SECRET!,
  },
  oauth: {
    facebook: {
      clientId: process.env.OAUTH_FACEBOOK_ID!,
      clientSecret: process.env.OAUTH_FACEBOOK_SECRET!,
      callbackURL: "https://scratchy.localdomain/api/oauth2/facebook/callback",
    },
    github: {
      clientId: process.env.OAUTH_GITHUB_ID!,
      clientSecret: process.env.OAUTH_GITHUB_SECRET!,
      callbackURL: "https://scratchy.localdomain/api/oauth2/github/callback",
    },
    google: {
      clientId: process.env.OAUTH_GOOGLE_ID!,
      clientSecret: process.env.OAUTH_GOOGLE_SECRET!,
      callbackURL: "https://scratchy.localdomain/api/oauth2/google/callback",
    },
  },

  tokenTTLs: {
    accessToken: ms("10m"),
    refreshToken: ms("1d"),
    refreshTokenRememberMe: ms("30d"),
    forgotPasswordToken: ms("30m"),
    emailConfirmationToken: ms("30d"),
  },

  // aws: {
  //   host: process.env.AWS_S3_HOST!,
  //   bucket: process.env.AWS_S3_BUCKET!,
  //   accessKey: process.env.AWS_S3_ACCESS_KEY!,
  //   secretKey: process.env.AWS_S3_SECRET_KEY!,
  // },
};

type NodeEnv = "development" | "production" | "test";
type DebugLevel = "debug"|"info"|"warn"|"error";

export class Environment {
  @IsIn(["development", "production", "test"])
  public readonly env: NodeEnv = process.env.NODE_ENV as NodeEnv;

  @IsIn(["debug", "info", "warn", "error"])
  public readonly debugLevel: DebugLevel = process.env.DEBUG_LEVEL as DebugLevel;

  public readonly isDevelopment: boolean = this.env === "development";
  public readonly isProduction: boolean = this.env === "production";
  public readonly isTesting: boolean = this.env === "test";

  public readonly templatesDir = join(__dirname, "../../templates");

  public readonly enableDebugging = this.debugLevel === "debug";
  public readonly enablePlayground = !!process.env.ENABLE_PLAYGROUND;
  public readonly databaseURL = process.env.DATABASE_URL;
  public readonly queueURL = process.env.QUEUE_URL;

  public readonly mailedFrom = '"graphql-scratchy" <jason+scratchy@raimondi.us>';
  @IsUrl()
  public readonly mailerURL = process.env.MAILER_URL;

  @IsUrl()
  public readonly web = process.env.URL;

  @IsUrl()
  public readonly api = process.env.API_URL;
}

export { ENV };
