import { writable } from "svelte/store";

import { browser } from "$app/env";

import { localStorageService } from "$lib/storage/local_storage.service";
import { graphQLClient } from "$lib/api/api_sdk";
import type { DecodedJWT } from "$lib/auth/auth";
import { apiHttpClient } from "$lib/api/http_client";

export type AccessTokenStore = { token: string, decoded: DecodedJWT };

let init;

if (browser) init = localStorageService.get("accessToken") ?? undefined;

export const accessTokenStore = writable<AccessTokenStore>(init);

accessTokenStore.subscribe(accessToken => {
  if (accessToken?.token) {
    const bearerString = `Bearer ${accessToken.token}`;
    graphQLClient.setHeader("Authorization", bearerString);
    apiHttpClient.setHeader("Authorization", bearerString);
  }
  if (browser) localStorageService.set("accessToken", accessToken);
});
