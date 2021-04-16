import { NestFastifyApplication } from "@nestjs/platform-fastify";
import cookie from "fastify-cookie";
import csrf from "fastify-csrf";
import rateLimit from "fastify-rate-limit";
import helmet from "fastify-helmet";
import nunjucks from "nunjucks";

import { ENV } from "~/config/environments";
import { CORS } from "~/config/cors";

export const attachMiddlewares = async (fastify: NestFastifyApplication) => {
  await fastify.register(cookie, { secret: ENV.secrets.cookie });
  await fastify.register(csrf, { cookieOpts: { signed: true } });

  fastify.enableCors(CORS);

  await fastify.setViewEngine({
    engine: { nunjucks },
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
