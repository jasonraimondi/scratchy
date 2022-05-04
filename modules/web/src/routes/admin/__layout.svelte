<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/env";
  import { graphQLSdk } from "$lib/api/api_sdk";
  import { checkAuth } from "$lib/check_auth";
  import { notify } from "$ui/notifications/notification.service";
  import { logout } from "$lib/auth/auth";

  async function unauthorized(reason?: string) {
    notify.error(reason ?? "invalid access!");
    await logout({ sendNotification: false });
  }

  let isAdmin = false;

  onMount(async () => {
    if (!browser) return;
    const isAuth = await checkAuth();
    if (!isAuth) await unauthorized("not authenticated");
    const { me } = await graphQLSdk.Me();
    if (!me.isAdmin) await unauthorized("not admin");
    isAdmin = true;
  });
</script>

{#if browser && isAdmin}
  <h4 class="admin-banner">Admin Panel</h4>
  <slot />
{:else}
  <p>Admin panel is only rendered on the client.</p>
{/if}

<style lang="postcss">
  .admin-banner {
    background-color: var(--colors-red-400);
    border-bottom: 2px solid var(--colors-red-600);
    color: var(--colors-white);
    padding: 0.125em 0;
    text-align: center;
  }
</style>
