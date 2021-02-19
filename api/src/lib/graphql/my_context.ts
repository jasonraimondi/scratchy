import type { FastifyRequest, FastifyReply } from "fastify";
import type { User } from "~/app/user/entities/user.entity";

export interface MyContext {
  req: FastifyRequest | any;
  res: FastifyReply | any;
  user?: User;
  ipAddr: string;
}
