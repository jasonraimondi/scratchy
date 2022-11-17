import { z } from "zod";
import ms from "ms";

const NodeEnv = z.enum(["development", "production", "test"]);
type NodeEnv = z.infer<typeof NodeEnv>;
const DebugLevel = z.enum(["debug", "info", "warn", "error"]);
type DebugLevel = z.infer<typeof DebugLevel>;

export const EnvSchema = z.object({
  NODE_ENV: NodeEnv,
  DEBUG_LEVEL: DebugLevel,
  PORT: z.number().min(80).max(49151),

  APP_NAME: z.string(),
  APP_URL: z.string().url(),
  API_URL: z.string().url(),

  SECRET_JWT: z.string().min(32),
  SECRET_COOKIE: z.string().min(32),

  MAILER_SMTP_URL: z.string(),

  QUEUE_CONNECTION: z.object({
    host: z.string(),
    port: z.number(),
  }),
});

export type EnvSchema = z.infer<typeof EnvSchema>;
export const Env: EnvSchema = {
  PORT: Number(process.env.PORT) || 3000,

  NODE_ENV: process.env.NODE_ENV as EnvSchema["NODE_ENV"],
  DEBUG_LEVEL: process.env.DEBUG_LEVEL as EnvSchema["DEBUG_LEVEL"],

  APP_NAME: process.env.APP_NAME as EnvSchema["APP_NAME"],
  APP_URL: process.env.APP_URL as EnvSchema["APP_URL"],
  API_URL: process.env.API_URL as EnvSchema["API_URL"],

  SECRET_COOKIE: process.env.SECRET_COOKIE as EnvSchema["SECRET_COOKIE"],
  SECRET_JWT: process.env.SECRET_JWT as EnvSchema["SECRET_JWT"],

  MAILER_SMTP_URL: process.env.MAILER_SMTP_URL as EnvSchema["MAILER_SMTP_URL"],

  QUEUE_CONNECTION: {
    host: process.env.QUEUE_HOST as EnvSchema["QUEUE_CONNECTION"]["host"],
    port: Number(process.env.QUEUE_PORT) || 6379,
  },
};

export const TTLSchema = z.object({
  accessToken: z.number(),
  refreshToken: z.number(),
  refreshTokenRememberMe: z.number(),
  forgotPasswordToken: z.number(),
  emailConfirmationToken: z.number(),
});
export type TTLSchema = z.infer<typeof TTLSchema>;

export const TTL: TTLSchema = {
  accessToken: ms("15m"),
  emailConfirmationToken: ms("1d"),
  forgotPasswordToken: ms("1d"),
  refreshToken: ms("1h"),
  refreshTokenRememberMe: ms("3d"),
};

export const IS_TEST = process.env.NODE_ENV === "test";
export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
