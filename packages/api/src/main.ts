process.env.TZ = "UTC";

// import "reflect-metadata";
// import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv/config";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { validateOrReject } from "class-validator";

import { AppModule } from "~/app/app.module";
import { ENV } from "~/config/environments";
import { attachMiddlewares } from "~/lib/middleware/attach_middlewares";

void (async () => {
  await validateOrReject(ENV);

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  await attachMiddlewares(app);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableShutdownHooks();

  if (ENV.isDebug) {
    console.log(JSON.stringify(ENV));
  }

  await app.listen(4400, "0.0.0.0");

  console.log(`Listening on ${await app.getUrl()}`);
})();
