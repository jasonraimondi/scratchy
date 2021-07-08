import type { CookieSerializeOptions } from "fastify-cookie";

import { ENV } from "~/config/environments";

export const cookieOptions = (opts: CookieSerializeOptions = {}): CookieSerializeOptions => ({
  domain: ENV.urls.web?.hostname ?? undefined,
  sameSite: "strict",
  signed: false,
  secure: true,
  httpOnly: true,
  path: "/",
  ...opts,
});
