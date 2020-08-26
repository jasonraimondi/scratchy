import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv/config";

import { NestFactory } from "@nestjs/core";

import { ENV } from "~/lib/config/environment";
import { AppModule } from "~/app/app.module";

(async () => {
  if (ENV.enableDebugging) console.log("DEBUGGING ENABLED");
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log(`Listening on ${await app.getUrl()}`);
})();
