import { join } from "path";
import { z } from "zod";

import mailer from "~/config/mailer";
import oauth from "~/config/oauth";
import s3 from "~/config/s3";

export const NodeEnv = z.enum(["development", "production", "test"]);
export type NodeEnv = z.infer<typeof NodeEnv>;
export const DebugLevel = z.enum(["debug", "info", "warn", "error"]);
export type DebugLevel = z.infer<typeof DebugLevel>;

const OAuthEnv = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
});

export const EnvSchema = z.object({
  nodeEnv: NodeEnv,
  debugLevel: DebugLevel,
  port: z.number().min(80).max(49151),

  appName: z.string(),

  jwtSecret: z.string().min(32),
  cookieSecret: z.string().min(32),

  mailer: z.object({
    from: z.string().email(),
    host: z.string().min(1),
  }),

  oauth: z.object({
    facebook: OAuthEnv,
    github: OAuthEnv,
    google: OAuthEnv,
  }),

  queue: z.object({
    host: z.string().min(1),
    port: z.number().min(80).max(49151),
  }),

  ttl: z.object({
    accessToken: z.number(),
    refreshToken: z.number(),
    refreshTokenRememberMe: z.number(),
    forgotPasswordToken: z.number(),
    emailConfirmationToken: z.number(),
  }),

  s3: z.object({
    accessKeyId: z.string().min(1),
    secretAccessKey: z.string().min(1),
    bucket: z.string().min(1),
    endpoint: z.string().optional(),
    region: z.string().min(1),
  }),

  urlWeb: z.string().min(1),
  urlApi: z.string().min(1),
  urlDatabase: z.string().min(1),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

export abstract class Environment implements EnvSchema {
  abstract nodeEnv: NodeEnv;
  abstract ttl: EnvSchema["ttl"];

  debugLevel: DebugLevel = process.env.DEBUG_LEVEL as DebugLevel;

  port = Number(process.env.PORT) || 3000;

  appName = process.env.APP_NAME as string;

  templatesDir = join(__dirname, "../../../templates");

  s3: EnvSchema["s3"] = s3;

  oauth = oauth;
  mailer = mailer;

  queue = {
    port: Number(process.env.QUEUE_PORT) || 6379,
    host: process.env.QUEUE_HOST as string,
  };

  corsDomains: string[] =
    process.env.CORS_DOMAINS?.split(",")
      .filter(el => el !== "")
      .map(domain => new URL(domain).hostname) ?? [];

  urlWeb = process.env.APP_URL as string;
  urlApi = process.env.API_URL as string;
  urlDatabase = process.env.DATABASE_URL as string;

  jwtSecret = process.env.JWT_SECRET as string;
  cookieSecret = process.env.COOKIE_SECRET as string;

  get includeQueueModule() {
    return process.env.INCLUDE_QUEUE_MODULE !== "false";
  }

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
}
