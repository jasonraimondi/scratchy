import ms from "ms";
import { join } from "path";
import { IsIn, IsString, IsUrl, MinLength, ValidateNested } from "class-validator";

type NodeEnv = "development" | "production" | "test";
type DebugLevel = "debug" | "info" | "warn" | "error";

class Environment {
  @IsIn(["development", "production", "test"])
  readonly nodeEnv: NodeEnv = process.env.NODE_ENV as NodeEnv;

  @IsIn(["debug", "info", "warn", "error"])
  readonly debugLevel: DebugLevel = process.env.DEBUG_LEVEL as DebugLevel;

  readonly isDebug = this.debugLevel === "debug";
  readonly isDevelopment = this.nodeEnv === "development";
  readonly isProduction = this.nodeEnv === "production";
  readonly isTesting = this.nodeEnv === "test";

  readonly templatesDir = join(__dirname, "../../templates");

  @IsUrl() readonly urlWeb = process.env.URL;
  @IsUrl() readonly urlApi = process.env.API_URL;
  @IsString() readonly urlDatabase = process.env.DATABASE_URL;
  @IsString() readonly urlQueue = process.env.QUEUE_URL;

  readonly ttlAccessToken = ms("10m");
  readonly ttlRefreshToken = ms("1d");
  readonly ttlRefreshTokenRememberMe = ms("30d");
  readonly ttlForgotPasswordToken = ms("30m");
  readonly ttlEmailConfirmationToken = ms("30d");

  @IsString()
  @MinLength(32)
  readonly jwtSecret = process.env.JWT_SECRET;

  @IsString()
  @MinLength(32)
  readonly cookieSecret = process.env.COOKIE_SECRET;

  @ValidateNested() readonly oauth = new OAuthEnvironment();
  @ValidateNested() readonly mailer = new MailerEnvironment();
}

class MailerEnvironment {
  readonly from = '"graphql-scratchy" <jason+scratchy@raimondi.us>';
  @IsString() readonly host = process.env.SMTP_HOST;
}

class OAuthEnvironment {
  @ValidateNested() readonly facebook = new OAuthFacebookEnvironment();
  @ValidateNested() readonly github = new OAuthGithubEnvironment();
  @ValidateNested() readonly google = new OAuthGoogleEnvironment();
}

class OAuthFacebookEnvironment {
  @IsString() readonly clientId = process.env.OAUTH_FACEBOOK_ID!;
  @IsString() readonly clientSecret = process.env.OAUTH_FACEBOOK_SECRET!;
  @IsString() readonly callbackURL = "/api/oauth2/facebook/callback";
}

class OAuthGoogleEnvironment {
  @IsString() readonly clientId = process.env.OAUTH_GOOGLE_ID!;
  @IsString() readonly clientSecret = process.env.OAUTH_GOOGLE_SECRET!;
  @IsString() readonly callbackURL = "/api/oauth2/google/callback";
}

class OAuthGithubEnvironment {
  @IsString() readonly clientId = process.env.OAUTH_GITHUB_ID!;
  @IsString() readonly clientSecret = process.env.OAUTH_GITHUB_SECRET!;
  @IsString() readonly callbackURL = "/api/oauth2/facebook/callback";
}

export const ENV = new Environment();
