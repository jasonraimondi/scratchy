import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv/config";

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { ENV } from "~/config/environment";
import { QueueWorkerModule } from "~/lib/queue-workers/queue_worker.module";

(async () => {
  const applicationLogger = new Logger("__queue__");
  if (ENV.enableDebugging) applicationLogger.debug("DEBUGGING ENABLED");
  const app = await NestFactory.create(QueueWorkerModule);
  await app.init();
})();
