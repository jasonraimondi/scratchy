import fastify from "fastify";
import ws from "@fastify/websocket";
import { OAuth2Namespace } from "@fastify/oauth2";
import { Provider } from "$generated/client";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";

import { Env, IS_PRODUCTION } from "$config/env";
import { logger } from "$lib/utils/logger";
import facebookProvider from "$server/oauth2/facebook_provider";
import githubProvider from "$server/oauth2/github_provider";
import googleProvider from "$server/oauth2/google_provider";
import { createContext } from "$trpc/context";
import { appRouter } from "$trpc/routers";
import { CORS } from "$config/cors";

declare module "fastify" {
  interface FastifyInstance extends Record<Provider, OAuth2Namespace> {}
}

export function createServer() {
  const port = Env.PORT;
  const server = fastify({ logger: false });

  server.register(require("@fastify/cookie"), {
    secret: Env.SECRET_COOKIE,
  });
  server.register(require("@fastify/cors"), CORS);
  if (IS_PRODUCTION) {
    server.register(require("@fastify/helmet"));
    server.register(require("@fastify/rate-limit"), {
      max: 200,
      timeWindow: "1 minute",
    });
  }

  server.register(ws);
  server.register(fastifyTRPCPlugin, {
    prefix: "/api/trpc",
    useWSS: true,
    trpcOptions: { router: appRouter, createContext },
  });

  server.get("/api/ping", (_, res) => {
    res.send("pong");
  });

  facebookProvider(server);
  githubProvider(server);
  googleProvider(server);

  const stop = () => server.close();
  const start = async () => {
    await server.listen({ port });
    logger.info(`>> listening on port ${port}`);
  };

  return { server, start, stop };
}
