import { Injectable, NestMiddleware } from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";

import { LoggerService } from "~/lib/logger/logger.service";
import { TokenService } from "~/app/auth/services/token.service";
import { AccessTokenJWTPayload } from "~/app/auth/dto/refresh_token.dto";
import { getTokenFromBearerString } from "~/app/auth/guards/jwt_auth.guard";

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService, private readonly logger: LoggerService) {}

  async use(req: FastifyRequest, _: FastifyReply, next: () => void): Promise<void> {
    const accessToken = getTokenFromBearerString(req);

    this.logger.debug(accessToken?.slice(0, 10), "accessToken");

    if (typeof accessToken !== "string") return next();

    try {
      const { user } = await this.tokenService.verifyToken<AccessTokenJWTPayload>(accessToken);
      this.logger.debug(JSON.stringify(user.email), "currentUser");
      req.user = user;
    } catch (e) {
      this.logger.error(e);
    }

    next();
  }
}
