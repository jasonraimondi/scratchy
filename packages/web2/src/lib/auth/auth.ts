import { browser } from "$app/env";
import { goto } from "$app/navigation";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { get, writable } from "svelte/store";

import { notify } from "$lib/notifications/notification.service";
import { graphQLClient, graphQLSdk } from "$lib/api/api_sdk";
import { backoffCallback } from "$lib/utils/backoff_callback";
import { localStorageService } from "$lib/storage/local_storage.service";

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

type AccessToken = { token: string, decoded: DecodedJWT };

let init;

if (browser) {
  init = localStorageService.get("accessToken") ?? undefined;
}

export const accessTokenStore = writable<AccessToken>(init);

accessTokenStore.subscribe(accessToken => {
  if (accessToken?.token) graphQLClient.setHeader("Authorization", `Bearer ${accessToken.token}`);
  localStorageService.set("accessToken", accessToken);
});

export async function login(input: LoginParams) {
  try {
    const { login } = await graphQLSdk.Login({ input });
    setAccessToken(login.accessToken);
    notify.success("Welcome!");
    await goto("/app/dashboard", { replaceState: true });
  } catch (error) {
    return notify.error({ title: "Login Error", message: error.message });
  }
}

export async function logout() {
  try {
    await graphQLSdk.Logout();
    notify.info({ title: "Goodbye", message: "Logging out", ttl: 10000 });
    accessTokenStore.set(undefined);
    // currentUser.set(undefined);
    await goto("/login", { replaceState: true });
  } catch (error) {
    notify.error(error.message);
  }
}

export async function refreshToken() {
  if (Cookies.get('canRefresh') !== "y") return false;

  const attemptRefresh = async () => {
    const { refreshAccessToken } = await graphQLSdk.RefreshAccessToken();
    setAccessToken(refreshAccessToken.accessToken);
    notify.success("Token Refreshed");
  };

  try {
    const attempts = 2;
    await backoffCallback(attemptRefresh, attempts);
    return true;
  } catch (err) {
    notify.error(err.message);
    return false;
  }
}

export function setAccessToken(token: string) {
  accessTokenStore.set({ token, decoded: jwtDecode<DecodedJWT>(token) });
}

export function isAuthenticated() {
  const { token, decoded } = get(accessTokenStore);
  if (!token || !decoded) return false;
  const expiresAt = new Date(decoded.exp * 1000);
  return new Date() < expiresAt;
}
