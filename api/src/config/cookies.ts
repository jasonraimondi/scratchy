import type { CookieSerializeOptions } from "@fastify/cookie";

export const COOKIES = {
  refreshToken: "__Host-jid",
};

export const cookieOptions = (opts: CookieSerializeOptions = {}): CookieSerializeOptions => ({
  sameSite: "strict",
  signed: true,
  secure: true,
  httpOnly: true,
  path: "/",
  ...opts,
});
