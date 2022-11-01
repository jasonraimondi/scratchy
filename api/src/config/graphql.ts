import { FastifyReply, FastifyRequest } from "fastify";
import { MercuriusDriver, MercuriusDriverConfig } from "@nestjs/mercurius";

import { ENV } from "~/config/environment";
import { User } from "~/entities/user.entity";

export interface MyContext {
  req: FastifyRequest | any;
  res: FastifyReply | any;
  user?: User;
  ipAddr: string;
}

export const graphqlConfig: MercuriusDriverConfig = {
  driver: MercuriusDriver,
  path: "api/graphql",
  graphiql: ENV.isDevelopment,
  ide: ENV.isDevelopment,
  autoSchemaFile: "schema.graphql",
  buildSchemaOptions: {
    numberScalarMode: "integer",
    dateScalarMode: "timestamp",
  },
  context: (request: FastifyRequest, reply: FastifyReply): Partial<MyContext> => {
    const raw: any = request.raw;
    request.user = request.user ?? raw.user;
    return {
      ipAddr: request.ips?.[0] || request.ip,
      user: request.user,
      req: request,
      res: reply,
    };
  },
};
