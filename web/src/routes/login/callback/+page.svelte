<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { setAccessToken } from "$lib/auth/auth";
  import { notify } from "$ui/notifications/notification.service";

  onMount(() => {
    const accessToken = $page.url.searchParams.get("token");

    if (accessToken) {
      setAccessToken(accessToken);
      notify.success("Welcome!")
      goto("/app")
    } else {
      notify.error("Error authenticating")
    }

  });
</script>

Redirecting...
