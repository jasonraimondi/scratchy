import type { User } from "./app/user/entities/user.entity";

declare module "fastify" {
  interface FastifyRequest {
    user?: User;
  }
}
