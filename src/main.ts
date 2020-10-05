import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv/config";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import nunjucks from "nunjucks";
import { join } from "path";

import { AppModule } from "~/app/app.module";
import { LoggerService } from "~/lib/logger/logger.service";
import { attachMiddlewares } from "~/lib/middlewares/attach_middlewares";
import { ENV } from "~/config/environment";

const logger = new LoggerService("__main__");

(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  attachMiddlewares(app);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));


  // app.useStaticAssets(join(__dirname, '..', 'public'));
  // app.setBaseViewsDir(join(__dirname, '..', 'templates'));
  app.setViewEngine('njk');

  nunjucks.configure(join(__dirname, '../templates'), {
    autoescape: true,
    express: app
  });

  if (ENV.enableDebugging) {
    logger.debug("DEBUGGING ENABLED");
    logger.debug(ENV);
  }
  await app.listen(3000);
  logger.log(`Listening on ${await app.getUrl()}`);
})();
