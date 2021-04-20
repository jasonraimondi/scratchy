import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv/config";

import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { ENV } from "~/config/environments";
import { QueueWorkerModule } from "~/app/queue/queue_worker.module";

(async () => {
  const applicationLogger = new Logger("__queue__");
  if (ENV.enableDebugging) applicationLogger.debug("DEBUGGING ENABLED");
  const app = await NestFactory.create(QueueWorkerModule, new FastifyAdapter());
  await app.init();
})();
