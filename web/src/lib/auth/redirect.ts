import { onMount } from "svelte";
import { goto } from "$app/navigation";
import { accessTokenStore } from "$lib/auth/access_token";
import { get } from "svelte/store";
import { isAuthenticated } from "$lib/auth/auth";

export const redirectIfAuthenticated = () =>
  onMount(() => {
    const accessToken = get(accessTokenStore);
    console.log("redirectIfAuthenticated", accessToken, isAuthenticated(accessToken));
    if (isAuthenticated(accessToken)) goto("/app", { replaceState: true });
  });

export const redirectIfUnauthenticated = () =>
  onMount(() => {
    const accessToken = get(accessTokenStore);
    if (!isAuthenticated(accessToken)) goto("/login", { replaceState: true });
  });
