<script lang="ts">
  import { notify } from "$lib/notifications/notification.service";
</script>

<button on:click={() => notify.info("This is my info")}>Info</button>
<button on:click={() => notify.success("This is my Woah")}>Success</button>
<button on:click={() => notify.error("This is an error")}>Error</button>
