import { NestFastifyApplication } from "@nestjs/platform-fastify";
import nunjucks from "nunjucks";

import { OAuthProviders } from "~/config/oauth_providers";
import { ENV } from "~/config/environment";

export const attachMiddlewares = async (fastify: NestFastifyApplication) => {
  await fastify.register(require("@fastify/cookie"), { secret: ENV.cookieSecret });
  await fastify.register(require("@fastify/csrf-protection"), { cookieOpts: { signed: true } });

  const oauthPlugin = require("@fastify/oauth2");

  for (const provider of OAuthProviders) {
    await fastify.register(oauthPlugin, provider);
  }

  fastify.setViewEngine({
    engine: { nunjucks },
    templates: ENV.templatesDir,
    includeViewExtension: true,
    viewExt: "njk",
  });

  if (ENV.isProduction) {
    await fastify.register(require("@fastify/helmet"));
    await fastify.register(require("@fastify/rate-limit"), {
      max: 100,
      timeWindow: "1 minute",
    });
  }

  // if (!ENV.isTesting) {
  //   const { registerBullBoard } = await import("~/libs/middleware/bull_board");
  //   await registerBullBoard(fastify);
  // }
};
