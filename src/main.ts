process.env.TZ = "UTC";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import "dotenv/config";
import nunjucks from "nunjucks";
import { join } from "path";
import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";

import { AppModule } from "~/app/app.module";
import { ENV } from "~/config/environment";
import { LoggerService } from "~/lib/logger/logger.service";
import { attachMiddlewares } from "~/lib/middlewares/attach_middlewares";

const logger = new LoggerService("__main__");

(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  attachMiddlewares(app);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // @todo configure cors
  app.enableCors();

  nunjucks.configure(join(__dirname, "../templates"), {
    autoescape: true,
    express: app,
  });
  app.setViewEngine("njk");

  if (ENV.enableDebugging) {
    logger.debug("DEBUGGING ENABLED");
    logger.debug(ENV);
  }
  await app.listen(3000);
  logger.log(`Listening on ${await app.getUrl()}`);
})();
