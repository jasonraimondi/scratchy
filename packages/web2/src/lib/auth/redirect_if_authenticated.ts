import { onMount } from "svelte";
import { get } from "svelte/store";
import { currentUserStore } from "$lib/auth/current_user";
import { goto } from "$app/navigation";

export const redirectIfAuthenticated = () => onMount(() => {
  const currentUser = get(currentUserStore);
  if (currentUser) goto("/app/dashboard");
})