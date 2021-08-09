<script lang="ts">
  import { currentUserStore } from "$lib/auth/current_user";
  import { notify } from "$lib/notifications/notification.service";
</script>

<div class="debug-bar">
  <button class="info" on:click={() => notify.info("This is my info")}>Info</button>
  <button class="success" on:click={() => notify.success("This is my Woah")}>Success</button>
  <button class="error" on:click={() => notify.error("This is an error")}>Error</button>
  <p><strong>UserId:</strong> {$currentUserStore?.id.substr(0, 4)}...</p>
</div>

<style lang="postcss">
  .debug-bar {
      display: flex;
      align-items: center;
      background-color: var(--colors-amber-200);
  }

  button {
      margin: 0.4em 0.2em;
  }
</style>