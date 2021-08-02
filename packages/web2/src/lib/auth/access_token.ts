import { browser } from "$app/env";
import { localStorageService } from "$lib/storage/local_storage.service";
import { writable } from "svelte/store";
import { graphQLClient } from "$lib/api/api_sdk";
import type { DecodedJWT } from "$lib/auth/auth";

export type AccessTokenStore = { token: string, decoded: DecodedJWT };

let init;

if (browser) {
  init = localStorageService.get("accessToken") ?? undefined;
}

export const accessTokenStore = writable<AccessTokenStore>(init);

accessTokenStore.subscribe(accessToken => {
  if (accessToken?.token) graphQLClient.setHeader("Authorization", `Bearer ${accessToken.token}`);
  localStorageService.set("accessToken", accessToken);
});
