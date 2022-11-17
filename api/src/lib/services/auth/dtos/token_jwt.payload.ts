import type { JwtPayload } from "jsonwebtoken";

export type TokenJwtPayload = JwtPayload & {
  // [key: string]: any;
  // iss?: string | undefined;
  // sub?: string | undefined;
  // aud?: string | string[] | undefined;
  // exp?: number | undefined;
  // nbf?: number | undefined;
  // iat?: number | undefined;
  // jti?: string | undefined;

  userId: string;
  tokenVersion: number;
};

export type RefreshTokenPayload = TokenJwtPayload & {
  rememberMe: boolean;
};

export type AccessTokenPayload = TokenJwtPayload & {
  email: string;
  isEmailConfirmed: boolean;
  roles: string[];
};
