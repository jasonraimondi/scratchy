import ms from "ms";
import { join } from "path";
import { IsIn, IsNumber, IsString, Max, MinLength, ValidateNested } from "class-validator";

import { OAUTH } from "~/config/oauth";
import { MAILER } from "~/config/mailer";
import { CORS } from "~/config/cors";

export type NodeEnv = "development" | "production" | "test";
export type DebugLevel = "debug" | "info" | "warn" | "error";

export abstract class Environment {
  @IsIn(["development", "production", "test"])
  nodeEnv: NodeEnv = process.env.NODE_ENV as NodeEnv;

  @IsIn(["debug", "info", "warn", "error"])
  debugLevel: DebugLevel = process.env.DEBUG_LEVEL as DebugLevel;

  @IsNumber()
  @Max(49151)
  port = 4400;

  get isDebug() {
    return this.debugLevel === "debug";
  }
  get isDevelopment() {
    return this.nodeEnv === "development";
  }
  get isProduction() {
    return this.nodeEnv === "production";
  }
  get isTesting() {
    return this.nodeEnv === "test";
  }

  templatesDir = join(__dirname, "../../../templates");

  s3 = {
    accessKeyId: process.env.S3_FILE_UPLOADS_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_FILE_UPLOADS_SECRET_KEY as string,
    bucket: process.env.S3_FILE_UPLOADS_BUCKET as string,
    endpoint: "http://localhost:9000",
    region: "us-east-1",
  };

  ttl = {
    accessToken: ms("1h"),
    refreshToken: ms("36h"),
    refreshTokenRememberMe: ms("30d"),
    forgotPasswordToken: ms("30m"),
    emailConfirmationToken: ms("14d"),
  };

  @ValidateNested() oauth = OAUTH;
  @ValidateNested() mailer = MAILER;
  @ValidateNested() cors = CORS;

  @IsString() urlWeb = process.env.APP_URL as string;
  @IsString() urlApi = process.env.API_URL as string;
  @IsString() urlDatabase = process.env.DATABASE_URL as string;
  @IsString() urlQueue = process.env.QUEUE_URL as string;

  @IsString()
  @MinLength(32)
  jwtSecret = process.env.JWT_SECRET;

  @IsString()
  @MinLength(32)
  cookieSecret = process.env.COOKIE_SECRET;
}
