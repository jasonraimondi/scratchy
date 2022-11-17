import type { JwtPayload } from "jsonwebtoken";

import { tokenJwtService } from "~/lib/services/jwt_service";
import type { RefreshTokenPayload } from "~/lib/services/auth/dtos/token_jwt.payload";

export class RefreshTokenDTO {
  readonly exp: number = 0;
  readonly tokenVersion: number = -1;
  readonly userId?: string;

  constructor(readonly token = "") {
    if (!token || token === "") return;
    const decoded = tokenJwtService.decode(token);
    if (this.isRefreshTokenPayload(decoded)) {
      const { exp, sub, tokenVersion } = decoded;
      this.exp = exp ?? 0;
      this.userId = sub;
      this.tokenVersion = tokenVersion;
    }
  }

  get expiresAt(): Date {
    return new Date(this.exp * 1000);
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  private isRefreshTokenPayload(token: null | JwtPayload | string): token is RefreshTokenPayload {
    if (!token || typeof token === "string") return false;
    return (token as RefreshTokenPayload).userId !== undefined;
  }
}
