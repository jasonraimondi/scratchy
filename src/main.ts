import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv/config";

import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";

import { AppModule } from "~/app/app.module";
import { attachMiddlewares } from "~/lib/attach_middlewares";
import { ENV } from "~/lib/config/environment";

(async () => {
  if (ENV.enableDebugging) console.log("DEBUGGING ENABLED");
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  attachMiddlewares(app);
  await app.listen(3000);
  console.log(`Listening on ${await app.getUrl()}`);
})();
