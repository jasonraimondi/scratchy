import type { OAuth2Namespace } from 'fastify-oauth2';

import type { User } from "./entities/user.entity";

declare module "fastify" {
  interface FastifyInstance {
    Google: OAuth2Namespace;
    GitHub: OAuth2Namespace;
  }

  interface FastifyRequest {
    user?: User;
  }
}
