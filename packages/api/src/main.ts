process.env.TZ = "UTC";

// import "reflect-metadata";
// import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv/config";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { validate, ValidationError } from "class-validator";
import { BullMqServer } from "bull-mq-transport";

import { AppModule } from "~/app/app.module";
import { ENV } from "~/config/environment";
import { attachMiddlewares } from "~/lib/middleware/attach_middlewares";

async function validateEnvironment() {
  const validationErrors = await validate(ENV);
  if (validationErrors.length === 0) return;
  const errors = validationErrors
    .reduce((prev, next) => {
      const result = [...prev];
      if (next.children?.length) result.push(...next.children);
      return [next, ...result];
    }, [] as ValidationError[])
    .map((e) => {
      if (!e.constraints) return undefined;
      return Object.values(e.constraints).map((v) => {
        const [first, ...split] = v.split(" ");
        const result = [`"${first}"`, ...split].join(" ");
        return `** ${e.target?.constructor.name} ${result} **`;
      });
    })
    .filter((e) => e !== undefined);
  throw new Error(`Invalid Environment \n\n${errors.join("\n- ")}\n`);
}

void (async () => {
  await validateEnvironment();
  if (ENV.isDebug) console.log(ENV);

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  await attachMiddlewares(app);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableShutdownHooks();

  const strategy = app.get(BullMqServer);
  app.connectMicroservice({ strategy }, { inheritAppConfig: true });
  await app.startAllMicroservices();

  await app.listen(ENV.port, "0.0.0.0");

  console.log(`Listening on ${await app.getUrl()}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
