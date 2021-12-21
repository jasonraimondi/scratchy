import ms from "ms";
import { join } from "path";
import { IsIn, IsString, IsUrl, MinLength, ValidateNested } from "class-validator";

type NodeEnv = "development" | "production" | "test";
type DebugLevel = "debug" | "info" | "warn" | "error";

class Environment {
  @IsIn(["development", "production", "test"])
  nodeEnv: NodeEnv = process.env.NODE_ENV as NodeEnv;

  @IsIn(["debug", "info", "warn", "error"])
  debugLevel: DebugLevel = process.env.DEBUG_LEVEL as DebugLevel;

  isDebug = this.debugLevel === "debug";
  isDevelopment = this.nodeEnv === "development";
  isProduction = this.nodeEnv === "production";
  isTesting = this.nodeEnv === "test";

  templatesDir = join(__dirname, "../../templates");

  @IsUrl() urlWeb = process.env.URL as string;
  @IsUrl() urlApi = process.env.API_URL as string;
  @IsString() urlDatabase = process.env.DATABASE_URL as string;
  @IsString() urlQueue = process.env.QUEUE_URL as string;

  redisQueue = { host: 'localhost', port: 6379 };

  ttlAccessToken = ms("10m");
  ttlRefreshToken = ms("1d");
  ttlRefreshTokenRememberMe = ms("30d");
  ttlForgotPasswordToken = ms("30m");
  ttlEmailConfirmationToken = ms("30d");

  @IsString()
  @MinLength(32)
  jwtSecret = process.env.JWT_SECRET;

  @IsString()
  @MinLength(32)
  cookieSecret = process.env.COOKIE_SECRET;

  @ValidateNested() oauth = new OAuthEnvironment();
  @ValidateNested() mailer = new MailerEnvironment();
}

class MailerEnvironment {
  from = '"graphql-scratchy" <jason+scratchy@raimondi.us>';
  @IsString() host = process.env.SMTP_HOST;
}

class OAuthEnvironment {
  @ValidateNested() facebook = new OAuthFacebookEnvironment();
  @ValidateNested() github = new OAuthGithubEnvironment();
  @ValidateNested() google = new OAuthGoogleEnvironment();
}

class OAuthFacebookEnvironment {
  @IsString() clientId = process.env.OAUTH_FACEBOOK_ID!;
  @IsString() clientSecret = process.env.OAUTH_FACEBOOK_SECRET!;
  @IsString() callbackURL = "/api/oauth2/facebook/callback";
}

class OAuthGoogleEnvironment {
  @IsString() clientId = process.env.OAUTH_GOOGLE_ID!;
  @IsString() clientSecret = process.env.OAUTH_GOOGLE_SECRET!;
  @IsString() callbackURL = "/api/oauth2/google/callback";
}

class OAuthGithubEnvironment {
  @IsString() clientId = process.env.OAUTH_GITHUB_ID!;
  @IsString() clientSecret = process.env.OAUTH_GITHUB_SECRET!;
  @IsString() callbackURL = "/api/oauth2/facebook/callback";
}

export const ENV: Readonly<Environment> = new Environment();
