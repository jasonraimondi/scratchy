import ms from "ms";
import { Injectable } from "@nestjs/common";

import { UserRepo } from "~/app/user/repositories/repositories/user.repository";
import { MyJwtService } from "~/lib/jwt/jwt.service";
import { User } from "~/app/user/entities/user.entity";
import { CookieOptions, Response } from "express";
import { ENV } from "~/config/configuration";
import { AccessTokenJWTPayload, RefreshTokenJWTPayload } from "~/app/auth/dto/refresh_token.dto";
import { TokenPayload } from "~/app/auth/strategies/jwt.strategy";
import { LoginResponse } from "~/app/account/resolvers/auth/login_response";

export function roundToSeconds(ms: Date | number) {
  if (ms instanceof Date) ms = ms.getTime();
  return Math.ceil(ms / 1000);
}

@Injectable()
export class AuthService {
  private readonly accessTokenTimeout = "15m";
  private readonly refreshTokenTimeout = "2h";
  private readonly refreshTokenTimeoutRemember = "7d";

  constructor(private userRepository: UserRepo, private jwtService: MyJwtService) {}

  async login(email: string, pass: string): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(email);
    await user.verify(pass);
    const accessToken = await this.createAccessToken(user);
    return { accessToken, user };
  }

  async updateAccessToken(refreshToken: string): Promise<LoginResponse> {
    let payload: { sub: string; iat: string; tokenVersion: number };
    try {
      payload = await this.jwtService.verify(refreshToken);
    } catch (_) {
      throw new Error("invalid refresh token");
    }

    const id = payload.sub ?? "NOT_FOUND";
    const user = await this.userRepository.findById(id);

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new Error("invalid refresh token");
    }

    const accessToken = await this.createAccessToken(user);

    return { accessToken, user };
  }

  async sendRefreshToken(res: Response, rememberMe: boolean, user?: User) {
    let token = "";

    if (user) {
      token = await this.createRefreshToken(user, rememberMe);
    }

    let expires = 0;

    if (token !== "") {
      expires = ms(rememberMe ? this.refreshTokenTimeoutRemember : this.refreshTokenTimeout);
    }

    console.log("refresh", { expires: new Date(Date.now() + expires), expiresETA: expires });

    const options = this.cookieOptions({ expires: new Date(Date.now() + expires) });

    res.cookie("rememberMe", rememberMe, options);
    res.cookie("jid", token, options);
  }

  private async createRefreshToken(user: User, rememberMe = false) {
    const now = Date.now();
    const payload: RefreshTokenJWTPayload = {
      // non standard claims
      tokenVersion: user.tokenVersion,

      // standard claims
      iss: undefined,
      sub: user.id,
      aud: undefined,
      exp: roundToSeconds(now + ms(rememberMe ? this.refreshTokenTimeoutRemember : this.refreshTokenTimeout)),
      nbf: roundToSeconds(now),
      iat: roundToSeconds(now),
    };
    return this.jwtService.sign(payload);
  }

  private createAccessToken(user: User) {
    const now = Date.now();
    const payload: AccessTokenJWTPayload = {
      // non standard claims
      email: user.email,
      isEmailConfirmed: user.isEmailConfirmed,

      // standard claims
      iss: undefined,
      sub: user.id,
      aud: undefined,
      exp: roundToSeconds(now + ms(this.accessTokenTimeout)),
      nbf: roundToSeconds(now),
      iat: roundToSeconds(now),
    };
    return this.jwtService.sign(payload);
  }

  private cookieOptions(opts: CookieOptions = {}): CookieOptions {
    return {
      domain: ENV.url!.hostname,
      sameSite: "strict",
      httpOnly: true,
      ...opts,
    };
  }
}
