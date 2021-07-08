import type { FastifyReply } from "fastify";
import { Injectable } from "@nestjs/common";

import { UserRepository } from "~/lib/database/repositories/user.repository";
import { User } from "~/entities/user.entity";
import { cookieOptions } from "~/config/cookies";
import { LoggerService } from "~/lib/logger/logger.service";
import { TokenService } from "~/app/auth/services/token.service";
import { RefreshTokenJWTPayload } from "~/app/auth/dto/refresh_token.dto";
import { LoginResponse } from "~/app/auth/resolvers/auth.response";

type LoginInput = {
  res: FastifyReply;
  ipAddr: string;
  rememberMe?: boolean;
};

type LoginWithEmail = LoginInput & {
  email: string;
  password: string;
};

type LoginWithUser = LoginInput & {
  user: User;
};

type SendRefreshTokenInput = {
  res: FastifyReply;
  rememberMe?: boolean;
  user?: User;
};

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private tokenService: TokenService,
    private logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async login({
    res,
    ipAddr = "127.0.0.4",
    rememberMe = false,
    ...input
  }: LoginWithUser | LoginWithEmail): Promise<LoginResponse> {
    let user: User;
    if ("user" in input) {
      user = input.user;
    } else {
      const { email, password } = input;
      user = await this.userRepository.findByEmail(email, { include: { roles: true, permissions: true } });
      await user.verify(password);
    }
    await this.userRepository.incrementLastLogin(user.id, ipAddr);
    const accessToken = await this.tokenService.createAccessToken(user);
    const refreshTokenExpiresAt = await this.sendRefreshToken({ res, rememberMe, user });
    return { ...accessToken, refreshTokenExpiresAt, user };
  }

  async logout(res: FastifyReply): Promise<boolean> {
    await this.sendRefreshToken({ res, rememberMe: false });
    return true;
  }

  async refreshAccessToken(refreshToken: string): Promise<LoginResponse> {
    const payload = await this.tokenService.verifyToken<RefreshTokenJWTPayload>(refreshToken);
    const user = await this.userRepository.findById(payload.sub);
    const isExpired = user.tokenVersion !== payload.tokenVersion;
    if (isExpired) {
      throw new Error("invalid refresh token");
    }
    const accessToken = await this.tokenService.createAccessToken(user);
    return { ...accessToken, user };
  }

  private async sendRefreshToken({ res, rememberMe = false, user }: SendRefreshTokenInput): Promise<number> {
    if (!user) {
      res.setCookie("jid", "", cookieOptions({ expires: new Date(0) }));
      res.setCookie("canRefresh", "", cookieOptions({ expires: new Date(0), httpOnly: false }));
      return 0;
    }
    const { refreshToken, refreshTokenExpiresAt } = await this.tokenService.createRefreshToken(user, rememberMe);
    res.setCookie("jid", refreshToken, cookieOptions({ expires: new Date(refreshTokenExpiresAt) }));
    res.setCookie("canRefresh", "y", cookieOptions({ expires: new Date(refreshTokenExpiresAt), httpOnly: false }));
    return refreshTokenExpiresAt;
  }
}
