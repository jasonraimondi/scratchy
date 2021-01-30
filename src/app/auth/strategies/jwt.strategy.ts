import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, Logger } from "@nestjs/common";

import { ENV } from "~/config/configuration";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";

export type TokenPayload = {
  userId: string;
  email: string;
  iat?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly userRepository: UserRepo) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ENV.secret,
    });
  }

  async validate(payload: any): Promise<any> {
    const { userId }: TokenPayload = payload;
    return await this.userRepository.findById(userId);
    // const isExpired = Date.now() / 1000 > (exp ?? 0);
    //
    // if (isExpired) {
    //   throw new UnauthorizedException();
    // }
    //
    // let token: Token;
    //
    // try {
    //   token = await this.tokenRepo.findById(jti);
    //   this.logger.log("FOUND TOKEN");
    // } catch (_) {
    //   throw new UnauthorizedException("token not found");
    // }
    //
    // if (!token || token.isRevoked) {
    //   this.logger.log("TOKEN IS EXPIRED");
    //   throw new UnauthorizedException("token revoked");
    // }
    //
    // this.logger.log("SUCCESS");

    // return token.user;
  }
}
