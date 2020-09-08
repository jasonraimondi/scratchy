import jwtDecode from "jwt-decode";

export interface IJWTToken {
  iat: number;
  exp: number;
  userId: string;
  email: string;
  isEmailConfirmed: boolean;
}

export class RefreshTokenDTO {
  readonly exp: number = 0;
  readonly token: string;
  readonly userId?: string;

  constructor(token = "") {
    this.token = token;
    if (token) {
      try {
        const { exp, userId } = jwtDecode<IJWTToken>(token);
        this.exp = exp;
        this.userId = userId;
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
