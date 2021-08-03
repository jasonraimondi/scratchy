<script>
  import { redirectIfUnauthenticated } from "$lib/auth/redirect";
  redirectIfUnauthenticated();
</script>

{#if isAuth}
  <h1>IS AUTH</h1>
  <slot />
{:else}
  <h1>Hold it right there</h1>
{/if}
