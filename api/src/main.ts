process.env.TZ = "UTC";

import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv/config";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";

import { AppModule } from "~/app/app.module";
import { ENV } from "~/config/configuration";
import { LoggerService } from "~/lib/logger/logger.service";
import { attachMiddlewares } from "~/lib/middlewares/attach_middlewares";

const logger = new LoggerService("__main__");

(async () => {
  const fastify = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  await attachMiddlewares(fastify);
  fastify.useGlobalPipes(new ValidationPipe({ transform: true }));

  if (ENV.enableDebugging) {
    logger.debug("DEBUGGING ENABLED");
    logger.debug(ENV);
  }

  await fastify.listen(3001, "0.0.0.0");

  logger.log(`Listening on ${await fastify.getUrl()}`);
})();
