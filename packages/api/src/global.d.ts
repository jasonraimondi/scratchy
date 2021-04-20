import type { User } from "./entities/user.entity";

declare module "fastify" {
  interface FastifyRequest {
    user?: User;
  }
}
