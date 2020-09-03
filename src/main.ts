import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv/config";

import { NestFactory } from "@nestjs/core";
import { UI as bullUI } from "bull-board";
import type { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import { ENV } from "~/lib/config/environment";
import { AppModule } from "~/app/app.module";

(async () => {
  if (ENV.enableDebugging) console.log("DEBUGGING ENABLED");
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use("/admin/queues", bullUI);
  app.use(cookieParser());
  if (process.env.NODE_ENV === "production") {
    app.use(helmet());
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
      }),
    );
  }
  await app.listen(3000);
  console.log(`Listening on ${await app.getUrl()}`);
})();
