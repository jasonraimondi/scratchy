import type { OAuth2Namespace } from "fastify-oauth2";
import type { User } from "./entities/user.entity";

declare module "fastify" {
  interface FastifyInstance {
    facebook: OAuth2Namespace;
    github: OAuth2Namespace;
    google: OAuth2Namespace;
  }

  interface FastifyRequest {
    user?: User;
  }
}
