import ms from "ms";
import { join } from "path";
import { IsIn, IsNumber, IsString, Max, MinLength, ValidateNested } from "class-validator";

import { OAUTH } from "~/config/oauth";
import { MAILER } from "~/config/mailer";

export type NodeEnv = "development" | "production" | "test";
export type DebugLevel = "debug" | "info" | "warn" | "error";

class QueueConnection {
  @IsNumber()
  @Max(49151)
  port = Number(process.env.QUEUE_PORT) as number;

  @IsString()
  host = process.env.QUEUE_HOST as string;
}

type AwsConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  endpoint?: string;
  region: string;
};

export abstract class Environment {
  abstract nodeEnv: NodeEnv;

  @IsIn(["debug", "info", "warn", "error"])
  debugLevel: DebugLevel = process.env.DEBUG_LEVEL as DebugLevel;

  @IsNumber()
  @Max(49151)
  port = Number(process.env.PORT) || 3000;

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

  s3: AwsConfig = {
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
  @ValidateNested() queue = new QueueConnection();

  @IsString() urlWeb = process.env.APP_URL as string;
  @IsString() urlApi = process.env.API_URL as string;
  @IsString() urlDatabase = process.env.DATABASE_URL as string;

  @IsString()
  @MinLength(32)
  jwtSecret = process.env.JWT_SECRET;

  @IsString()
  @MinLength(32)
  cookieSecret = process.env.COOKIE_SECRET;
}
