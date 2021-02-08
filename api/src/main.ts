process.env.TZ = "UTC";

import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv/config";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import nunjucks from "nunjucks";

import { AppModule } from "~/app/app.module";
import { ENV } from "~/config/configuration";
import { LoggerService } from "~/lib/logger/logger.service";
import { attachMiddlewares } from "~/lib/middlewares/attach_middlewares";

const logger = new LoggerService("__main__");

(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  attachMiddlewares(app);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  nunjucks.configure(ENV.templatesDir, {
    autoescape: true,
    express: app,
  });

  app.setViewEngine("njk");

  if (ENV.enableDebugging) {
    logger.debug("DEBUGGING ENABLED");
    logger.debug(ENV);
  }
  await app.listen(3001);
  logger.log(`Listening on ${await app.getUrl()}`);
})();
