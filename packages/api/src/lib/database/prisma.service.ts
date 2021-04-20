import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

import { LoggerService } from "~/lib/logger/logger.service";
import { ENV } from "~/config/environments";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly logger: LoggerService) {
    super({
      rejectOnNotFound: true,
      log: ENV.enableDebugging && !ENV.isTesting ? ["query", "info", "warn", "error"] : [],
    });
    this.logger.setContext(this.constructor.name);
  }

  async onModuleInit() {
    this.logger.debug("prisma connecting...");
    const now = Date.now();
    await this.$connect();
    this.logger.debug(`prisma connected ${Date.now() - now}ms`);
  }

  async onModuleDestroy() {
    this.logger.debug("ON MODULE DESTROY");
    this.logger.debug(`prisma disconnecting...`);
    const now = Date.now();
    await this.$disconnect();
    this.logger.debug(`prisma disconnected ${Date.now() - now}ms`);
  }
}
