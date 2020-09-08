import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv/config";

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";

import { AppModule } from "~/app/app.module";
import { attachMiddlewares } from "~/lib/middlewares/attach_middlewares";
import { ENV } from "~/config/environment";

const logger = new Logger("__main__");

(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  attachMiddlewares(app);
  await app.listen(3000);
  if (ENV.enableDebugging) {
    logger.debug("DEBUGGING ENABLED");
    logger.debug(ENV);
  }
  logger.log(`Listening on ${await app.getUrl()}`);
})();
