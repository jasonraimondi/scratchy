import { default as jwtDecode, JwtPayload } from "jwt-decode";

export type TokenJwtPayload = JwtPayload & {
  userId: string;
  tokenVersion: number;
};

export type RefreshTokenJWTPayload = TokenJwtPayload & {
  rememberMe: boolean;
};

export type AccessTokenJWTPayload = TokenJwtPayload & {
  email: string;
  isEmailConfirmed: boolean;
  roles: string[];
};

export class RefreshTokenDTO {
  readonly exp: number = 0;
  readonly token: string = "";
  readonly tokenVersion: number = -1;
  readonly userId?: string;

  constructor(token?: string) {
    if (token && token !== "") {
      this.token = token;
      try {
        const { exp, sub, tokenVersion } = jwtDecode<RefreshTokenJWTPayload>(token);
        this.exp = exp ?? 0;
        this.userId = sub;
        this.tokenVersion = tokenVersion;
      } catch {}
    }
  }

  get expiresAt(): Date {
    return new Date(this.exp * 1000);
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
