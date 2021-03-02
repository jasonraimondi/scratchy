import { NestFastifyApplication } from "@nestjs/platform-fastify";
import cookieParser from "fastify-cookie";
import rateLimit from "fastify-rate-limit";
import helmet from "fastify-helmet";
import nunjucks from "nunjucks";

import { ENV } from "~/config/environments";

export const corsConfig = {
  origin: true,
  credentials: true,
};

export const attachMiddlewares = async (fastify: NestFastifyApplication) => {
  await fastify.register(cookieParser);

  fastify.enableCors(corsConfig);

  await fastify.setViewEngine({
    engine: {
      nunjucks,
    },
    templates: ENV.templatesDir,
    includeViewExtension: true,
    viewExt: "njk",
  });

  if (ENV.isProduction) {
    await fastify.register(helmet);
    await fastify.register(rateLimit, {
      max: 100,
      timeWindow: "1 minute",
    });
  }

  // if (!ENV.isTesting) {
  //   fastify.use("/admin/queues", bullUI);
  // }
};
