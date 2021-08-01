<script lang="ts">
  import { notify } from "$lib/notifications/notification.service";
</script>

<div>
  <button class="info" on:click={() => notify.info("This is my info")}>Info</button>
  <button class="success" on:click={() => notify.success("This is my Woah")}>Success</button>
  <button class="error" on:click={() => notify.error("This is an error")}>Error</button>
</div>

<style>
  div {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      background-color: tomato;
      padding: 0.2em;
  }
  button {
      margin-right: 0.2em;
  }
</style>