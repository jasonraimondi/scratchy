import { Injectable } from "@nestjs/common";

import { MyJwtService } from "~/lib/jwt/jwt.service";
import { User } from "~/entities/user.entity";
import { AccessTokenJWTPayload, RefreshTokenJWTPayload, TokenJwtPayload } from "~/app/auth/dto/refresh_token.dto";
import { ENV } from "~/config/environment";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { UnauthorizedException } from "~/lib/exceptions/unauthorized.exception";

@Injectable()
export class TokenService {
  constructor(private jwtService: MyJwtService, private readonly userRepository: UserRepository) {}

  async verifyToken<T extends TokenJwtPayload>(refreshToken: string): Promise<{ user: User; payload: T }> {
    try {
      const payload = await this.jwtService.verify<T>(refreshToken);
      const { userId, tokenVersion } = payload;
      const user = await this.userRepository.findById(userId, {
        include: { roles: { include: { role: true } }, permissions: { include: { permission: true } } },
      });
      if (Number(tokenVersion) !== Number(user.tokenVersion)) throw new Error();
      return { user, payload };
    } catch {
      throw new UnauthorizedException("invalid token");
    }
  }

  async createRefreshToken(user: User, rememberMe = false) {
    const ttl = rememberMe ? ENV.ttl.refreshTokenRememberMe : ENV.ttl.refreshToken;
    const now = Date.now();
    const expiresAt = now + ttl;
    const payload: RefreshTokenJWTPayload = {
      // non standard claims
      rememberMe,
      userId: user.id,
      tokenVersion: user.tokenVersion,

      // standard claims
      iss: undefined,
      sub: user.id,
      aud: undefined,
      exp: this.roundToSeconds(expiresAt),
      // nbf: this.roundToSeconds(now),
      iat: this.roundToSeconds(now),
    };
    return {
      refreshToken: await this.jwtService.sign(payload),
      refreshTokenExpiresAt: expiresAt,
    };
  }

  async createAccessToken(user: User) {
    const now = Date.now();
    const expiresAt = now + ENV.ttl.accessToken;
    const payload: AccessTokenJWTPayload = {
      // non standard claims
      userId: user.id,
      email: user.email,
      isEmailConfirmed: user.isEmailConfirmed,
      roles: user.rolesList,
      tokenVersion: user.tokenVersion,

      // standard claims
      iss: undefined,
      sub: user.id,
      aud: undefined,
      exp: this.roundToSeconds(expiresAt),
      // nbf: this.roundToSeconds(now),
      iat: this.roundToSeconds(now),
    };
    return {
      accessToken: await this.jwtService.sign(payload),
      accessTokenExpiresAt: new Date(expiresAt),
    };
  }

  private roundToSeconds(ms: Date | number) {
    if (ms instanceof Date) ms = ms.getTime();
    return Math.ceil(ms / 1000);
  }
}
