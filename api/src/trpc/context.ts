import { inferAsyncReturnType } from "@trpc/server";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import type { User } from "$generated/client";
import type { FastifyReply, FastifyRequest } from "fastify";

import { logger } from "~/lib/utils/logger";

export function getTokenFromBearerString(authorization?: string): string | undefined {
  const [type, code] = authorization?.split(" ") ?? [];
  if (type?.toLowerCase() !== "bearer") return undefined;
  return code;
}

export async function createContext({ req, res }: CreateFastifyContextOptions): Promise<{
  req: FastifyRequest;
  res: FastifyReply;
  logger: typeof logger;
  ipAddr: string;
  user?: User;
}> {
  return { req, res, logger, user: undefined, ipAddr: req.ip };
}

export type Context = inferAsyncReturnType<typeof createContext>;
