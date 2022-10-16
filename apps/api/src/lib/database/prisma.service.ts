import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@lib/prisma";

import { LoggerService } from "~/lib/logger/logger.service";
import { ENV } from "~/config/environment";

// prettier-ignore
type LogLevel = ["query", "info", "warn", "error"] |
                ["info", "warn", "error"] |
                ["warn", "error"] |
                ["error"];

const logLevel: Record<typeof ENV.debugLevel, LogLevel> = {
  debug: ["query", "info", "warn", "error"],
  info: ["info", "warn", "error"],
  warn: ["warn", "error"],
  error: ["error"],
};

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly logger: LoggerService) {
    super({
      rejectOnNotFound: true,
      log: logLevel[ENV.debugLevel],
    });
  }

  async onModuleInit() {
    this.logger.debug("prisma connecting...");
    const now = Date.now();
    await this.$connect();
    this.logger.debug(`prisma connected in ${Date.now() - now}ms`);
  }

  async onModuleDestroy() {
    this.logger.debug(`prisma disconnecting...`);
    const now = Date.now();
    await this.$disconnect();
    this.logger.debug(`prisma disconnected in ${Date.now() - now}ms`);
  }
}
