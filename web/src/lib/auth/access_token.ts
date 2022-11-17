import { writable } from "svelte/store";

import { browser } from "$app/environment";
import type { DecodedJWT } from "$lib/auth/auth";
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

  if (browser) {
    if (token) {
      // @todo update browser lib
      cookieStorageService.set(COOKIES.accessToken, accessToken, { expires: 1 });
    } else {
      cookieStorageService.remove(COOKIES.accessToken);
    }
  }
});
