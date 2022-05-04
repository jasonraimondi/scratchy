import { writable } from "svelte/store";

import { browser } from "$app/env";
import { graphQLClient } from "$lib/api/api_sdk";
import type { DecodedJWT } from "$lib/auth/auth";
import { apiHttpClient } from "$lib/api/http_client";
import { COOKIES, cookieStorageService } from "$lib/storage/storage.service";

export type AccessTokenStore = { token: string; decoded: DecodedJWT };

export const accessTokenStore = writable<AccessTokenStore | undefined>(
  cookieStorageService.get<AccessTokenStore>(COOKIES.accessToken) ?? undefined,
);

accessTokenStore.subscribe(accessToken => {
  if (accessToken?.token) {
    const bearerString = `Bearer ${accessToken.token}`;
    graphQLClient.setHeader("Authorization", bearerString);
    apiHttpClient.setHeader("Authorization", bearerString);
  }
  if (browser) cookieStorageService.set(COOKIES.accessToken, accessToken, { expires: 1 });
});
