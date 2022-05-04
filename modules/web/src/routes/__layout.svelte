<script lang="ts">
  import "normalize.css/normalize.css";
  import "$styles/app.pcss";

  import Footer from "$ui/Footer.svelte";
  import Header from "$ui/layouts/Header.svelte";
  import Notifications from "$ui/notifications/Notifications.svelte";
</script>

<Notifications />

<Header />

<main>
  <div class="app-window">
    <slot />
  </div>
  <Footer />
</main>

<style lang="postcss">
  :global(#_app) {
    height: 100%;
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
