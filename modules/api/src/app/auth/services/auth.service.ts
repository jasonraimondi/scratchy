import type { FastifyReply } from "fastify";
import { Injectable } from "@nestjs/common";

import { UserRepository } from "~/lib/database/repositories/user.repository";
import { User } from "~/entities/user.entity";
import { cookieOptions } from "~/config/cookies";
import { TokenService } from "~/app/auth/services/token.service";
import { RefreshTokenJWTPayload } from "~/app/auth/dto/refresh_token.dto";
import { LoginResponse } from "~/app/auth/dto/auth.dtos";

type Login = LoginWithUser | LoginWithEmail;

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository, private tokenService: TokenService) {
  }

  async login({ res, ipAddr, rememberMe = false, ...input }: Login): Promise<LoginResponse> {
    let user: User;
    if ("user" in input) {
      user = input.user;
    } else {
      const { email, password } = input;
      user = await this.userRepository.findByEmail(email, { roles: { include: { role: true } } });
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
    const { user } = await this.tokenService.verifyToken<RefreshTokenJWTPayload>(refreshToken);
    const accessToken = await this.tokenService.createAccessToken(user);
    return { ...accessToken, user };
  }

  private async sendRefreshToken({ res, rememberMe = false, user }: SendRefreshTokenInput): Promise<Date> {
    if (!user) {
      res.setCookie("jid", "", cookieOptions({ expires: new Date(0) }));
      res.setCookie("canRefresh", "", cookieOptions({ expires: new Date(0), httpOnly: false }));
      return new Date(0);
    }
    const { refreshToken, refreshTokenExpiresAt } = await this.tokenService.createRefreshToken(user, rememberMe);
    res.setCookie("jid", refreshToken, cookieOptions({ expires: new Date(refreshTokenExpiresAt) }));
    res.setCookie("canRefresh", "y", cookieOptions({ expires: new Date(refreshTokenExpiresAt), httpOnly: false }));
    return new Date(refreshTokenExpiresAt);
  }
}

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
