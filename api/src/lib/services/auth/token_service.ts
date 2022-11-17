import { prisma } from "$db";
import { TTL } from "$config/env";
import { tokenJwtService } from "$lib/services/jwt_service";
import { RefreshTokenPayload, TokenJwtPayload } from "$lib/services/auth/dtos/token_jwt.payload";
import type { User } from "$generated/client";

export namespace TokenService {
  type RefreshTokenUser = Pick<User, "id" | "tokenVersion">;

  export async function verifyToken<T extends TokenJwtPayload>(
    refreshToken: string,
  ): Promise<{ user: User; payload: T }> {
    const payload = tokenJwtService.verify<T>(refreshToken);
    const { userId: id, tokenVersion } = payload;
    const user = await prisma.user.findFirst({ where: { id, tokenVersion } });
    if (!user) throw new Error("invalid token");
    return { user, payload };
  }

  export async function createRefreshToken(user: RefreshTokenUser, rememberMe = false) {
    const ttl = rememberMe ? TTL.refreshTokenRememberMe : TTL.refreshToken;
    const now = Date.now();
    const expiresAt = now + ttl;
    const payload: RefreshTokenPayload = {
      expiresAt,
      rememberMe,
      userId: user.id,
      tokenVersion: user.tokenVersion,
    };
    return {
      refreshToken: await tokenJwtService.sign(payload),
      refreshTokenExpiresAt: new Date(expiresAt),
    };
  }

  type AccessTokenUser = Pick<User, "id" | "email" | "isEmailConfirmed" | "roles" | "tokenVersion">;

  export async function createAccessToken(user: AccessTokenUser) {
    const now = Date.now();
    const expiresAt = now + TTL.accessToken;
    const payload = {
      expiresAt,
      userId: user.id,
      email: user.email,
      isEmailConfirmed: user.isEmailConfirmed,
      roles: user.roles,
      tokenVersion: user.tokenVersion,
    };
    return {
      accessToken: await tokenJwtService.sign(payload),
      accessTokenExpiresAt: new Date(expiresAt),
    };
  }
  //
}
