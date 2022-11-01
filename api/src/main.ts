import "./config/initialize";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import type { OAuth2Namespace } from "@fastify/oauth2";
import { validateForm } from "@jmondi/form-validator";

import type { User } from "~/entities/user.entity";
import { AppModule } from "~/app/app.module";
import { ENV } from "~/config/environment";
import { attachMiddlewares } from "~/lib/middleware/attach_middlewares";
import { CORS } from "~/config/cors";
import { EnvSchema } from "~/config/environments/base";
import type { Provider } from "~/generated/client";
import { registerEnums } from "~/generated/entities";

declare module "fastify" {
  interface FastifyInstance extends Record<Provider, OAuth2Namespace> {}

  interface FastifyRequest {
    user?: User;
  }
}

void (async () => {
  const envErrors = await validateForm({ schema: EnvSchema, data: ENV }, { flatResult: true });

  if (envErrors) {
    console.error(envErrors);
    return;
  }

  if (ENV.isDebug) console.log(ENV);

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.enableCors(CORS);
  app.setGlobalPrefix("/api");
  await registerEnums();
  await attachMiddlewares(app);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableShutdownHooks();

  await app.listen(ENV.port, "0.0.0.0");
  console.log(`Listening on ${await app.getUrl()}`);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
