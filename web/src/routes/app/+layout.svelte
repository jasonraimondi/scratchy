<script lang="ts">
  import { beforeUpdate } from "svelte";

  import { browser } from "$app/environment";
  import { isAuthenticated, refreshToken } from "$lib/auth/auth";
  import { checkAuth } from "$lib/check_auth";

  beforeUpdate(() => async () => {
    await checkAuth();
    if (browser && !isAuthenticated()) await refreshToken();
  });

  $: isAuthed = isAuthenticated();
</script>

{#if isAuthed}
  <slot />
{:else}
  <p>Unauthenticated</p>
{/if}
