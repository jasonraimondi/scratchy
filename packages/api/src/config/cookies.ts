import type { CookieSerializeOptions } from "fastify-cookie";

import { ENV } from "~/config/environments";

export const cookieOptions = (opts: CookieSerializeOptions = {}): CookieSerializeOptions => ({
  domain: new URL(ENV.urlWeb).hostname,
  sameSite: "strict",
  signed: false,
  secure: true,
  httpOnly: true,
  path: "/",
  ...opts,
});
