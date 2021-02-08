import jwtDecode from "jwt-decode";

export interface JWTPayload {
  iss?: string; // @see https://tools.ietf.org/html/rfc7519#section-4.1.1
  sub: string; // @see https://tools.ietf.org/html/rfc7519#section-4.1.2
  aud?: string; // @see https://tools.ietf.org/html/rfc7519#section-4.1.3
  exp: number; // @see https://tools.ietf.org/html/rfc7519#section-4.1.4
  nbf: number; // @see https://tools.ietf.org/html/rfc7519#section-4.1.5
  iat: number; // @see https://tools.ietf.org/html/rfc7519#section-4.1.6
}

export interface RefreshTokenJWTPayload extends JWTPayload {
  tokenVersion: number;
}

export interface AccessTokenJWTPayload extends JWTPayload {
  email: string;
  isEmailConfirmed: boolean;
}

export class RefreshTokenDTO {
  readonly exp: number = 0;
  readonly token: string;
  readonly tokenVersion: number = -1;
  readonly userId?: string;

  constructor(token = "") {
    this.token = token;
    if (token) {
      try {
        const { exp, sub, tokenVersion } = jwtDecode<RefreshTokenJWTPayload>(token);
        this.exp = exp;
        this.userId = sub;
        this.tokenVersion = tokenVersion;
      } catch (e) {}
    }
  }

  get expiresAt(): Date {
    return new Date(this.exp * 1000);
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
