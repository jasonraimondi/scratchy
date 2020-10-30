import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Token } from "~/app/oauth/entities/token.entity";

import { TokenRepo } from "~/app/oauth/repositories/token.repository";
import { ENV } from "~/config/environment";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private tokenRepo: TokenRepo) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ENV.jwtSecret,
    });
  }

  async validate(payload: any): Promise<any> {
    const { jti, exp } = payload;

    const isExpired = Date.now() / 1000 > (exp ?? 0);
    this.logger.log({ jti, isExpired })

    if (isExpired) {
      throw new UnauthorizedException();
    }

    let token: Token;

    try {
      token = await this.tokenRepo.findById(jti);
      this.logger.log("FOUND TOKEN")
    } catch (_) {
      throw new UnauthorizedException("token not found");
    }

    if (!token || token.isRevoked) {
      this.logger.log("TOKEN IS EXPIRED")
      throw new UnauthorizedException("token revoked");
    }

    this.logger.log("SUCCESS")


    return token.user;
  }
}
