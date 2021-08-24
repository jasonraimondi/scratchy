import type { OAuth2Namespace } from "fastify-oauth2";

import type { User } from "./entities/user.entity";

declare module "fastify" {
  interface FastifyInstance {
    Facebook: OAuth2Namespace;
    GitHub: OAuth2Namespace;
    Google: OAuth2Namespace;
  }

  interface FastifyRequest {
    user?: User;
  }
}
