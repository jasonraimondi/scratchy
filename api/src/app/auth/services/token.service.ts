import { Injectable } from "@nestjs/common";

import { MyJwtService } from "~/lib/jwt/jwt.service";
import { User } from "~/entities/user.entity";
import { AccessTokenJWTPayload, JWTPayload, RefreshTokenJWTPayload } from "~/app/auth/dto/refresh_token.dto";
import { ENV } from "~/config/environments";

@Injectable()
export class TokenService {
  constructor(private jwtService: MyJwtService) {}

  async verifyToken<T extends JWTPayload>(refreshToken: string): Promise<T> {
    try {
      return this.jwtService.verify(refreshToken);
    } catch {
      throw new Error("invalid token");
    }
  }

  async createRefreshToken(user: User, rememberMe = false) {
    const ttl = rememberMe ? ENV.tokenTTLs.refreshTokenRememberMe : ENV.tokenTTLs.refreshToken;
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
    const expiresAt = now + ENV.tokenTTLs.accessToken;
    const payload: AccessTokenJWTPayload = {
      // non standard claims
      userId: user.id,
      email: user.email,
      isEmailConfirmed: user.isEmailConfirmed,
      roles: user.roles?.map((r) => r.name) ?? [],
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
      accessTokenExpiresAt: expiresAt,
    };
  }

  private roundToSeconds(ms: Date | number) {
    if (ms instanceof Date) ms = ms.getTime();
    return Math.ceil(ms / 1000);
  }
}
