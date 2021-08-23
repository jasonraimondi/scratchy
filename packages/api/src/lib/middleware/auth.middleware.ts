import { Injectable, NestMiddleware } from "@nestjs/common";
import { FastifyRequest, FastifyReply } from "fastify";

import { UserRepository } from "~/lib/database/repositories/user.repository";
import { fromFastifyAuthHeaderAsBearerToken } from "~/app/auth/_passport/strategies/jwt.strategy";
import { AccessTokenJWTPayload } from "~/app/auth/dto/refresh_token.dto";
import { TokenService } from "~/app/auth/services/token.service";
import { LoggerService } from "~/lib/logger/logger.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly logger: LoggerService,
  ) {}

  async use(req: FastifyRequest, _res: FastifyReply, next: any) {
    const accessToken = fromFastifyAuthHeaderAsBearerToken(req);

    if (typeof accessToken !== "string") {
      next();
      return;
    }

    try {
      const decoded: AccessTokenJWTPayload = await this.tokenService.verifyToken<AccessTokenJWTPayload>(accessToken);
      const user = await this.userRepository.findById(decoded.userId, { include: { roles: true, permissions: false } });
      if (Number(decoded.tokenVersion) === Number(user.tokenVersion)) {
        req.user = user;
      }
    } catch (e) {
      this.logger.log(e);
    }

    next();
  }
}
