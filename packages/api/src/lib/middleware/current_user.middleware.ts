import { Injectable, NestMiddleware } from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";

import { LoggerService } from "~/lib/logger/logger.service";
import { JwtAuthGuard } from "~/app/auth/guards/jwt_auth.guard";
import { TokenService } from "~/app/auth/services/token.service";
import { AccessTokenJWTPayload } from "~/app/auth/dto/refresh_token.dto";

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService, private readonly logger: LoggerService) {}

  async use(req: FastifyRequest, _res: FastifyReply, next: () => void): Promise<void> {
    const accessToken = JwtAuthGuard.getTokenFromBearerString(req);
    console.log({ accessToken });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (typeof accessToken !== "string") return next();

    try {
      const { user } = await this.tokenService.verifyToken<AccessTokenJWTPayload>(accessToken);
      this.logger.log(user.email);
      req.user = user;
    } catch (e) {
      this.logger.error(e);
    }

    next();
  }
}
