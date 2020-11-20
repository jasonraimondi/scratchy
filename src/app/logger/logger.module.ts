import { Module } from "@nestjs/common";

import { LoggerService } from "~/app/logger/logger.service";

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
