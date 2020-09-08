import { Inject } from "@nestjs/common";
import { CookieOptions, Response } from "express";
import { sign, verify } from "jsonwebtoken";

import { User } from "~/entity/user/user.entity";
import { ENV } from "~/config/environment";
import { REPOSITORY } from "~/config/keys";
import { IUserRepository } from "~/lib/repositories/user/user.repository";

export class AuthService {
  private readonly accessTokenTimeout = "15m";
  private readonly refreshTokenTimeout = "2h";
  private readonly refreshTokenTimeoutRemember = "7d";

  constructor(@Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository) {}

  async updateAccessToken(refreshToken: string) {
    let payload: any;
    try {
      payload = verify(refreshToken, ENV.refreshTokenSecret);
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
    return sign(payload, ENV.accessTokenSecret, {
      expiresIn: this.accessTokenTimeout,
    });
  }

  createRefreshToken(user: User, rememberMe = false): string {
    const payload = {
      userId: user.id,
      tokenVersion: user.tokenVersion,
    };
    return sign(payload, ENV.refreshTokenSecret, {
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
