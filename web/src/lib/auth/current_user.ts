import { writable } from "svelte/store";

import { browser } from "$app/environment";
import { SESSIONS, sessionStorageService } from "$lib/storage/storage.service";
import { accessTokenStore } from "$lib/auth/access_token";
import type { RouterOutput } from "$lib/api/trpc";

type MeOutput = RouterOutput["me"]["me"];

export type CurrentUser = { email: string; id: string };

let init;

if (browser) {
  init = sessionStorageService.get<CurrentUser>(SESSIONS.currentUser) ?? undefined;
}

export const currentUserStore = writable<CurrentUser | undefined>(init);

accessTokenStore.subscribe(async accessToken => {
  let currentUser: CurrentUser | undefined = undefined;
  if (accessToken?.decoded) {
    // currentUser = await trpc.me.me.query();
    currentUser = accessToken?.decoded
      ? {
          id: accessToken.decoded.userId,
          email: accessToken.decoded.email,
        }
      : undefined;
  }
  currentUserStore.set(currentUser);
});

currentUserStore.subscribe(currentUser => {
  if (browser) sessionStorageService.set(SESSIONS.currentUser, currentUser);
});
