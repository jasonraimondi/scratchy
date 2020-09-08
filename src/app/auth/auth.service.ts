import { Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CookieOptions, Response } from "express";

import { User } from "~/entity/user/user.entity";
import { ENV } from "~/config/environment";
import { REPOSITORY } from "~/config/keys";
import { IUserRepository } from "~/lib/repositories/user/user.repository";

export class AuthService {
  private readonly accessTokenTimeout = "15m";
  private readonly refreshTokenTimeout = "2h";
  private readonly refreshTokenTimeoutRemember = "7d";

  constructor(
    @Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository,
    private jwtService: JwtService,
  ) {}

  async updateAccessToken(refreshToken: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch (_) {
      throw new Error("invalid refresh token");
    }

    const id = payload?.userId ?? "NOT_FOUND";
    const user = await this.userRepository.findById(id);

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new Error("invalid refresh token");
    }

    return {
      accessToken: this.createAccessToken(user),
      user,
    };
  }

  createAccessToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      isEmailConfirmed: user.isEmailConfirmed,
    };
    return this.jwtService.sign(payload, {
      expiresIn: this.accessTokenTimeout,
    });
  }

  createRefreshToken(user: User, rememberMe = false): string {
    const payload = {
      userId: user.id,
      tokenVersion: user.tokenVersion,
    };
    return this.jwtService.sign(payload, {
      expiresIn: rememberMe ? this.refreshTokenTimeoutRemember : this.refreshTokenTimeout,
    });
  }

  sendRefreshToken(res: Response, rememberMe: boolean, user?: User) {
    let token = "";

    if (user) {
      token = this.createRefreshToken(user, rememberMe);
    }

    const options: CookieOptions = {
      httpOnly: true,
      domain: ENV.cookieDomain,
      expires: token === "" ? new Date() : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    };

    res.cookie("rememberMe", rememberMe, options);
    res.cookie("jid", token, options);
  }
}
