import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";

import type { IJWTToken } from "~/app/auth/dto/refresh_token.dto";
import { ENV } from "~/config/environment";
import { REPOSITORY } from "~/config/keys";
import { IUserRepository } from "~/lib/repositories/user/user.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(@Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ENV.jwtSecret,
    });
  }

  async validate(payload: IJWTToken): Promise<any> {
    this.logger.debug(payload);
    this.logger.debug("JASON I AM IN THE jwt.strategy")
    try {
      return await this.userRepository.findByEmail(payload.email);
    } catch (_) {
      throw new UnauthorizedException();
    }
  }
}