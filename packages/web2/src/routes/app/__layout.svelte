<script>
  import { accessTokenStore } from "$lib/auth/access_token";
  import { redirectIfUnauthenticated } from "$lib/auth/redirect";
  import { isAuthenticated } from "$lib/auth/auth";

  $: isAuth = isAuthenticated($accessTokenStore);

  redirectIfUnauthenticated();
</script>

<slot />

{#if isAuth}
  <h1>IS AUTH</h1>
{:else}
  <h1>Hold it right there</h1>
{/if}
