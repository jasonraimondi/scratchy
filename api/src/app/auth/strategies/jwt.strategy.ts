import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

import { ENV } from "~/config/configuration";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";
import { UnauthorizedException } from "~/app/user/exceptions/unauthorized.exception";
import type { FastifyRequest } from "fastify";

export type TokenPayload = {
  userId: string;
  email: string;
  tokenVersion: number;
  iat?: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepo) {
    super({
      jwtFromRequest: fromFastifyAuthHeaderAsBearerToken,
      ignoreExpiration: false,
      secretOrKey: ENV.secret,
    });
  }

  async validate({ userId, tokenVersion }: TokenPayload): Promise<any> {
    const user = await this.userRepository.findById(userId);

    if (Number(tokenVersion) !== user.tokenVersion) {
      throw new UnauthorizedException("invalid token");
    }

    return user;
  }
}

const fromFastifyAuthHeaderAsBearerToken = (request: FastifyRequest): string|unknown => {
  const auth = request.headers['authorization'];
  const token = auth?.split(' ')[1];
  return token;
}
