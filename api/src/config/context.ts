import { FastifyReply, FastifyRequest } from "fastify";
import { User } from "~/entities/user.entity";

export interface MyContext {
  req: FastifyRequest | any;
  res: FastifyReply | any;
  user?: User;
  ipAddr: string;
}
