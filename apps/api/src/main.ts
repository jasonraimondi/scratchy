process.env.TZ = "UTC";

import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv-flow/config";

import { registerEnums } from "@lib/prisma";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { validateOrReject } from "class-validator";
import type { OAuth2Namespace } from "@fastify/oauth2";
import type { Provider } from "@lib/prisma";

import type { User } from "~/entities/user.entity";
import { AppModule } from "~/app/app.module";
import { ENV } from "~/config/environment";
import { attachMiddlewares } from "~/lib/middleware/attach_middlewares";
import { CORS } from "~/config/cors";

declare module "fastify" {
  interface FastifyInstance extends Record<Provider, OAuth2Namespace> {}

  interface FastifyRequest {
    user?: User;
  }
}

void (async () => {
  await validateOrReject(ENV);

  if (ENV.isDebug) console.log(ENV);

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.setGlobalPrefix("/api");
  await registerEnums();
  await attachMiddlewares(app);
  app.enableCors(CORS);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableShutdownHooks();

  await app.listen(ENV.port);
  console.log(`Listening on ${await app.getUrl()}`);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
