import "./config/initialize";

import { FastifyAdapter } from "@nestjs/platform-fastify";
import { NestFactory } from "@nestjs/core";

import { QueueWorkerModule } from "~/lib/queue/queue_worker.module";

(async () => {
  const app = await NestFactory.create(QueueWorkerModule, new FastifyAdapter());
  await app.init();
})();
