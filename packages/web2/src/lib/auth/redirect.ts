import { onMount } from "svelte";
import { goto } from "$app/navigation";
import { accessTokenStore } from "$lib/auth/access_token";
import { get } from "svelte/store";
import { isAuthenticated } from "$lib/auth/auth";

export const redirectIfAuthenticated = () => onMount(() => {
  const accessToken = get(accessTokenStore);
  if (isAuthenticated(accessToken)) goto("/app/dashboard", { replaceState: true });
});

export const redirectIfUnauthenticated = () => onMount(() => {
  const accessToken = get(accessTokenStore);
  if (!isAuthenticated(accessToken)) goto("/login", { replaceState: true });
});
