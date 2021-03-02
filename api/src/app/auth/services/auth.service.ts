import ms from "ms";
import type { FastifyReply } from "fastify";
import type { CookieSerializeOptions } from "fastify-cookie";
import { Injectable } from "@nestjs/common";

import { UserRepo } from "~/app/user/repositories/repositories/user.repository";
import { MyJwtService } from "~/lib/jwt/jwt.service";
import { User } from "~/app/user/entities/user.entity";
import { ENV } from "~/config/environments";
import { AccessTokenJWTPayload, RefreshTokenJWTPayload } from "~/app/auth/dto/refresh_token.dto";
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

  loginOauth(user: User): Promise<string> {
    return this.createAccessToken(user);
  }

  async refreshAccessToken(refreshToken: string): Promise<LoginResponse> {
    let payload: Partial<RefreshTokenJWTPayload>;
    try {
      payload = await this.jwtService.verify(refreshToken);
    } catch (_) {
      throw new Error("invalid refresh token");
    }

    if (typeof payload.sub !== "string") {
      throw new Error("refresh token payload missing sub (userid)");
    }

    const user = await this.userRepository.findById(payload.sub);

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new Error("invalid refresh token");
    }

    const accessToken = await this.createAccessToken(user);

    return { accessToken, user };
  }

  async sendRefreshToken(res: FastifyReply, rememberMe: boolean, user?: User) {
    let token = "";

    if (user) {
      token = await this.createRefreshToken(user, rememberMe);
    }

    let expires = 0;

    if (token !== "") {
      expires = ms(rememberMe ? this.refreshTokenTimeoutRemember : this.refreshTokenTimeout);
    }

    const options = cookieOptions({ expires: new Date(Date.now() + expires) });

    res.setCookie("rememberMe", rememberMe.toString(), options);
    res.setCookie("jid", token, options);
  }

  private createRefreshToken(user: User, rememberMe = false) {
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

  // async refreshAccessToken(refreshToken: string): Promise<LoginResponse> {
  //   let payload: { sub: string; iat: string; tokenVersion: number };
  //   try {
  //     payload = await this.jwtService.verify(refreshToken);
  //   } catch (_) {
  //     throw new Error("invalid refresh token");
  //   }
  //
  //   const id = payload.sub ?? "NOT_FOUND";
  //   const user = await this.userRepository.findById(id);
  //
  //   if (user.tokenVersion !== payload.tokenVersion) {
  //     throw new Error("invalid refresh token");
  //   }
  //
  //   const accessToken = await this.createAccessToken(user);
  //
  //   return { accessToken, user };
  // }
}

const cookieOptions = (opts: CookieSerializeOptions = {}): CookieSerializeOptions => ({
  domain: ENV.url!.hostname,
  sameSite: "strict",
  httpOnly: true,
  ...opts,
});
