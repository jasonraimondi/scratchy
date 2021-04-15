import type { FastifyRequest, FastifyReply } from "fastify";
import type { User } from "~/entities/user.entity";

export interface MyContext {
  req: FastifyRequest | any;
  res: FastifyReply | any;
  user?: User;
  ipAddr: string;
}
