import { goto } from "$app/navigation";
import jwtDecode from "jwt-decode";
import { get } from "svelte/store";

import { graphQLSdk } from "$lib/api/api_sdk";
import { backoffCallback } from "$lib/utils/backoff_callback";
import { accessTokenStore } from "$lib/auth/access_token";
import type { AccessTokenStore } from "$lib/auth/access_token";
import { currentUserStore } from "$lib/auth/current_user";
import { notify } from "$ui/notifications/notification.service";

export type DecodedJWT = {
  email: string;
  userId: string;
  exp: number;
  iat: number;
  isEmailConfirmed: boolean;
  nbf: number;
  sub: string;
};

export type LoginParams = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export async function login(input: LoginParams) {
  try {
    const { login } = await graphQLSdk.Login({ input });
    setAccessToken(login.accessToken);
    notify.success({ message: "Welcome!", ttl: 1000 });
    await goto("/app");
  } catch (error: any) {
    return notify.error({ title: "Login Error", message: error.message });
  }
}

export async function logout({ sendNotification = true } = {}) {
  try {
    await graphQLSdk.Logout();
    if (sendNotification) notify.info({ message: "Goodbye!", ttl: 1000 });
    accessTokenStore.set(undefined);
    currentUserStore.set(undefined);
    await goto("/login", { replaceState: true });
  } catch (error: any) {
    notify.error(error.message);
  }
}

async function invalidRefreshAttempt(reason?: string) {
  notify.error(reason ?? "Unable to refresh token");
  await logout({ sendNotification: false });
  return false;
}

export async function refreshToken(): Promise<boolean> {
  let cnt = 0;

  const attemptRefresh = async () => {
    cnt++;
    notify.info("attempting to refresh: " + cnt);
    const { refreshAccessToken } = await graphQLSdk.RefreshAccessToken();
    setAccessToken(refreshAccessToken.accessToken);
    notify.success("Token Refreshed");
  };

  try {
    const attempts = 2;
    await backoffCallback(attemptRefresh, attempts);
    return true;
  } catch (error: any) {}
  return invalidRefreshAttempt();
}

export function setAccessToken(token: string) {
  accessTokenStore.set({ token, decoded: jwtDecode<DecodedJWT>(token) });
}

export function isAuthenticated(accessToken?: AccessTokenStore) {
  if (!accessToken) accessToken = get(accessTokenStore);
  if (!accessToken?.token || !accessToken?.decoded) return false;
  const expiresAt = new Date(accessToken.decoded.exp * 1000);
  return new Date() < expiresAt;
}
