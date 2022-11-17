import { PrismaClient } from "$generated/client";
import { Env } from "$config/env";

type LogLevel = ("query" | "info" | "warn" | "error")[];

const logLevel: Record<typeof Env.DEBUG_LEVEL, LogLevel> = {
  debug: ["query", "info", "warn", "error"],
  info: ["info", "warn", "error"],
  warn: ["warn", "error"],
  error: ["error"],
};

console.log({ level: logLevel[Env.DEBUG_LEVEL] });

export const prisma = new PrismaClient({
  log: logLevel[Env.DEBUG_LEVEL],
});
