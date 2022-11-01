import { writable } from "svelte/store";

import { browser } from "$app/environment";
import { graphQLClient } from "$lib/api/api_sdk";
import type { DecodedJWT } from "$lib/auth/auth";
import { apiHttpClient } from "$lib/api/http_client";
import { COOKIES, cookieStorageService } from "$lib/storage/storage.service";

export type AccessTokenStore = {
  token: string;
  decoded: DecodedJWT;
};

export const accessTokenStore = writable<AccessTokenStore | undefined>(
  cookieStorageService.get<AccessTokenStore>(COOKIES.accessToken) ?? undefined,
);

accessTokenStore.subscribe(accessToken => {
  const token = accessToken?.token;

  if (token) {
    graphQLClient.setHeader("Authorization", `Bearer ${token}`);
    apiHttpClient.setHeader("Authorization", `Bearer ${token}`);
  }

  if (browser) {
    if (token) {
      cookieStorageService.set(COOKIES.accessToken, token, { expires: 1 });
    } else {
      cookieStorageService.remove(COOKIES.accessToken);
    }
  }
});
