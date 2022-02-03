import ms from "ms";
import { join } from "path";
import { IsIn, IsNumber, IsString, IsUrl, Max, MinLength, ValidateNested } from "class-validator";

import { OAUTH } from "~/config/oauth";
import { MAILER } from "~/config/mailer";
import { CORS } from "~/config/cors";

type NodeEnv = "development" | "production" | "test";
type DebugLevel = "debug" | "info" | "warn" | "error";

class Environment {
  @IsIn(["development", "production", "test"])
  nodeEnv: NodeEnv = process.env.NODE_ENV as NodeEnv;

  @IsIn(["debug", "info", "warn", "error"])
  debugLevel: DebugLevel = process.env.DEBUG_LEVEL as DebugLevel;

  @IsNumber()
  @Max(49151)
  port = +(process.env.PORT ?? 4400);

  isDebug = this.debugLevel === "debug";
  isDevelopment = this.nodeEnv === "development";
  isProduction = this.nodeEnv === "production";
  isTesting = this.nodeEnv === "test";

  templatesDir = join(__dirname, "../../templates");

  ttl = {
    accessToken: ms("10m"),
    refreshToken: ms("1d"),
    refreshTokenRememberMe: ms("30d"),
    forgotPasswordToken: ms("30m"),
    emailConfirmationToken: ms("30d"),
  };

  @ValidateNested() oauth = OAUTH;
  @ValidateNested() mailer = MAILER;
  @ValidateNested() cors = CORS;

  @IsUrl() urlWeb = process.env.APP_URL as string;
  @IsUrl() urlApi = process.env.API_URL as string;
  @IsString() urlDatabase = process.env.DATABASE_URL as string;
  @IsString() urlQueue = process.env.QUEUE_URL as string;

  @IsString()
  @MinLength(32)
  jwtSecret = process.env.JWT_SECRET;

  @IsString()
  @MinLength(32)
  cookieSecret = process.env.COOKIE_SECRET;
}

export const ENV: Readonly<Environment> = new Environment();
