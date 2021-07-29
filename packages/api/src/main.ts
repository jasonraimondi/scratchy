process.env.TZ = "UTC";

import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv/config";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";

import { AppModule } from "~/app/app.module";
import { ENV } from "~/config/environments";
import { LoggerService } from "~/lib/logger/logger.service";
import { attachMiddlewares } from "~/lib/middleware/attach_middlewares";

(async () => {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  const logger = await app.resolve(LoggerService);
  logger.debug("main.ts");

  await attachMiddlewares(app);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableShutdownHooks();

  if (ENV.enableDebugging) {
    logger.debug("DEBUGGING ENABLED");
    logger.debug(ENV);
  }

  await app.listen(3001, "0.0.0.0");

  logger.log(`Listening on ${await app.getUrl()}`);
})();
