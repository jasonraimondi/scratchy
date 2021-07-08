import type { User } from "./entities/user.entity";
import type { CookieSerializeOptions } from "fastify-csrf";

declare module "fastify" {
  interface FastifyRequest {
    user?: User;
  }
}
