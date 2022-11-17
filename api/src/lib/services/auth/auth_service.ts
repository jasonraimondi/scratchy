import { FastifyReply } from "fastify";
import type { User } from "$generated/client";
import { TRPCError } from "@trpc/server";

import { cookieOptions, COOKIES } from "$config/cookies";
import { prismaUserByEmail, prismaUserIncrementLastLogin } from "$db/user";
import { verifyUser } from "$entities/user";
import { RefreshTokenDTO } from "$lib/services/auth/dtos/refresh_token.dto";
import { TokenService } from "$lib/services/auth/token_service";
import { LoginSchemaWithIP } from "$lib/services/auth/login";
import { logger } from "$lib/utils/logger";

export namespace AuthService {
  export async function refreshAccessToken(jid?: string) {
    logger.debug(`refreshing token: ${jid}`);
    const refreshToken = new RefreshTokenDTO(jid);
    logger.debug(JSON.stringify(refreshToken, null, 2));
    if (refreshToken.isExpired)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "refresh token failed",
      });
    const { user } = await TokenService.verifyToken(refreshToken.token);
    const accessToken = await TokenService.createAccessToken(user);
    return { ...accessToken, user };
  }

  export type LoginResponse = {
    user: User;
    accessToken: string;
    accessTokenExpiresAt: Date;
    refreshToken?: undefined;
    refreshTokenExpiresAt: Date;
  };

  export async function login(input: LoginSchemaWithIP) {
    let user: User;

    if ("user" in input) {
      user = input.user;
    } else if ("email" in input) {
      const { email, password } = input;
      user = await prismaUserByEmail(email);
      await verifyUser(user, password);
    } else {
      throw new Error("invalid login");
    }

    await prismaUserIncrementLastLogin({
      userId: user.id,
      ipAddr: input.ipAddr,
    });

    const [accessToken, refreshToken] = await Promise.all([
      TokenService.createAccessToken(user),
      TokenService.createRefreshToken(user, input.rememberMe),
    ]);

    return {
      user,
      accessToken: accessToken.accessToken,
      accessTokenExpiresAt: accessToken.accessTokenExpiresAt,
      refreshToken: refreshToken.refreshToken,
      refreshTokenExpiresAt: refreshToken.refreshTokenExpiresAt,
    };
  }

  export function setRefreshTokenCookie(
    res: FastifyReply,
    refreshToken: string = "",
    expires: Date = new Date(0),
  ) {
    logger.debug("Setting Cookie");
    logger.debug(refreshToken);
    logger.debug(JSON.stringify(cookieOptions({ expires }), null, 2));
    res.setCookie(COOKIES.refreshToken, refreshToken, cookieOptions({ expires }));
  }
}
