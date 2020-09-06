import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv/config";

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { ENV } from "~/lib/config/environment";
import { WorkerModule } from "~/lib/queue/worker.module";

const applicationLogger = new Logger("__queue__");

(async () => {
  if (ENV.enableDebugging) applicationLogger.debug("DEBUGGING ENABLED");
  const app = await NestFactory.create(WorkerModule);
  await app.init();
})();
