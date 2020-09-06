import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv/config";

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";

import { AppModule } from "~/app/app.module";
import { attachMiddlewares } from "~/lib/attach_middlewares";
import { ENV } from "~/lib/config/environment";

const applicationLogger = new Logger("__main__");

(async () => {
  if (ENV.enableDebugging) applicationLogger.debug("DEBUGGING ENABLED");
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  attachMiddlewares(app);
  await app.listen(3000);
  applicationLogger.log(`Listening on ${await app.getUrl()}`);
})();
