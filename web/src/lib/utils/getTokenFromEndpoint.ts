import type { DecodedJWT } from "$lib/auth/auth";
import { COOKIES } from "$lib/storage/storage.service";
import jwtDecode from "jwt-decode";
import type { Cookies } from "@sveltejs/kit";

type Token = { decoded?: DecodedJWT; isAuthorized: boolean; isUnauthorized: boolean };

function checkIsAuthorized(exp = 0) {
  const expireAt = new Date(exp * 1000);
  return new Date() < expireAt;
}

function respond(decoded?: DecodedJWT) {
  return {
    isAuthorized: Boolean(decoded),
    isUnauthorized: !Boolean(decoded),
    decoded,
  };
}

export function getTokenFromEndpoint(cookies: Cookies): Token {
  try {
    const token = JSON.parse(cookies.get(COOKIES.accessToken)!);
    const decoded = jwtDecode<DecodedJWT>(token);
    const isAuthorized = checkIsAuthorized(decoded?.exp);
    if (isAuthorized && token) {
      // graphQLClient.setHeader("Authorization", `Bearer ${token}`);
      return respond(decoded);
    }
  } catch (e) {}

  return respond();
}
