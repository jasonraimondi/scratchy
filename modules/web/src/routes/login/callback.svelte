<script lang="ts">
  import { page } from "$app/stores";
  import { setAccessToken } from "$lib/auth/auth";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { browser } from "$app/env";

  type LoginResponse = {
    accessToken: string;
    user: any;
    accessTokenExpiresAt: number;
    refreshTokenExpiresAt?: number;
  };

  let encodedToken = $page.url.searchParams.get("encoded_token");

  if (browser && encodedToken) {
    encodedToken = atob(encodedToken);
    const decodedToken: LoginResponse = JSON.parse(encodedToken);
    setAccessToken(decodedToken.accessToken);
  }

  onMount(() => {
    goto("/app");
  });
</script>

Redirecting...
