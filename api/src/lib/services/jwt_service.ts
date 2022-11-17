import jwt from "jsonwebtoken";

import { Env } from "~/config/env";

type Payload = Record<string, string | string[] | number | boolean> & {
  userId?: string;
  expiresAt?: number;
};

class JwtService {
  constructor(private readonly secret: string) {}

  decode<T = string | jwt.JwtPayload | null>(token: string) {
    console.log({ token, decoded: jwt.decode(token) });
    return jwt.decode(token) as T;
  }

  sign({ expiresAt, userId, ...payload }: Payload): string {
    const now = this.roundToSeconds(Date.now());
    return jwt.sign(
      {
        iss: undefined,
        sub: userId,
        aud: undefined,
        exp: expiresAt ? this.roundToSeconds(expiresAt) : new Date(0),
        nbf: now,
        iat: now,
        userId,
        ...payload,
      },
      this.secret,
    );
  }

  verify<T = string | jwt.JwtPayload | null>(token: string) {
    return jwt.verify(token, this.secret) as T;
  }

  private roundToSeconds(ms: Date | number) {
    if (ms instanceof Date) ms = ms.getTime();
    return Math.ceil(ms / 1000);
  }
}

export const tokenJwtService = new JwtService(Env.SECRET_JWT);
