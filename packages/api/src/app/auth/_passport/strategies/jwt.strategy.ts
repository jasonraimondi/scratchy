import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

import { ENV } from "~/config/environments";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { UnauthorizedException } from "~/lib/exceptions/unauthorized.exception";
import type { FastifyRequest } from "fastify";
import { User } from "~/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: fromFastifyAuthHeaderAsBearerToken,
      ignoreExpiration: false,
      secretOrKey: ENV.secrets.jwt,
    });
  }

  async validate(payload: TokenPayload): Promise<User> {
    const { userId, tokenVersion } = payload;
    const user = await this.userRepository.findById(userId);
    if (Number(tokenVersion) !== Number(user.tokenVersion)) {
      throw new UnauthorizedException("invalid token");
    }
    return user;
  }
}

export type TokenPayload = {
  userId: string;
  email: string;
  tokenVersion: number;
  iat?: number;
};

export const fromFastifyAuthHeaderAsBearerToken = (request: FastifyRequest): string | undefined => {
  const auth = request.headers["authorization"];
  const [type, code] = auth?.split(" ") ?? [];
  if (type.toLowerCase() !== "bearer") return undefined;
  return code;
};
