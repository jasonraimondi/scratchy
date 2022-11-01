<script lang="ts">
  import "normalize.css/normalize.css";
  import "$styles/app.pcss";

  import { page } from "$app/stores";
  import Footer from "$ui/Footer.svelte";
  import Header from "$ui/layouts/Header.svelte";
  import Notifications from "$ui/notifications/Notifications.svelte";

  const SHOW_FOOTER_ROUTES = ["/"];

  $: showFooter = SHOW_FOOTER_ROUTES.includes($page.url.pathname);
</script>

<Notifications />

<Header />

<main>
  <div class="app-window">
    <slot />
  </div>
  {#if showFooter}<Footer />{/if}
</main>

<style lang="postcss">
  :global(#_app) {
    width: 100%;

    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .app-window {
    flex: 1;
  }
</style>
