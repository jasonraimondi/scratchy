import { parse } from "cookie";
import type { DecodedJWT } from "$lib/auth/auth";
import type { AccessTokenStore } from "$lib/auth/access_token";
import { COOKIES } from "$lib/storage/storage.service";
import { graphQLClient } from "$lib/api/api_sdk";

export const UNAUTHORIZED_RESPONSE = { status: 401 };

type Token = { decoded?: DecodedJWT; isAuthorized: boolean; isUnauthorized: boolean };

function checkIsAuthorized(exp = 0) {
  const expireAt = new Date(exp * 1000);
  return new Date() < expireAt;
}

export function getTokenFromEndpoint(request: Request): Token {
  const cookies = parse(request.headers.get("cookie") ?? "");
  try {
    const { decoded, token }: AccessTokenStore = JSON.parse(cookies[COOKIES.accessToken]) || {};
    const isAuthorized = checkIsAuthorized(decoded?.exp);
    if (isAuthorized && token) graphQLClient.setHeader("Authorization", `Bearer ${token}`);
    return { isAuthorized, isUnauthorized: !isAuthorized, decoded };
  } catch (e) {
    return { isAuthorized: false, isUnauthorized: true };
  }
}
