import type { CookieSerializeOptions } from "fastify-cookie";

import { ENV } from "~/config/environments";

export const COOKIES = {
  authorization: "axs__authorization", // accepted scopes
  token: "axs__user", // logged in
  redirectHelper: "axs__redirect", // catch cb from external oauth
};

export const cookieOptions = (opts: CookieSerializeOptions = {}): CookieSerializeOptions => ({
  domain: ENV.urls.web?.hostname ?? undefined,
  sameSite: "strict",
  signed: false,
  secure: true,
  httpOnly: true,
  path: "/",
  ...opts,
});
