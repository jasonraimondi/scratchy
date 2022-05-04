import { writable } from "svelte/store";
import type { User } from "@modules/web-api-client/src/generated/graphql";
import { browser } from "$app/env";
import { sessionStorageService, SESSIONS } from "$lib/storage/storage.service";
import { accessTokenStore } from "$lib/auth/access_token";
import { graphQLSdk } from "$lib/api/api_sdk";

export type CurrentUser = Partial<User> & { email: string; id: string };

let init;

if (browser) {
  init = sessionStorageService.get<CurrentUser>(SESSIONS.currentUser) ?? undefined;
}

export const currentUserStore = writable<CurrentUser | undefined>(init);

accessTokenStore.subscribe(async accessToken => {
  let currentUser: CurrentUser | undefined = undefined;
  if (accessToken?.decoded) {
    const { me } = await graphQLSdk.Me();
    currentUser = me;
  }
  currentUserStore.set(currentUser);
});

currentUserStore.subscribe(currentUser => {
  if (browser) sessionStorageService.set(SESSIONS.currentUser, currentUser);
});
