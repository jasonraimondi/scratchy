<script lang="ts">
  import { onMount } from "svelte";
  import { logout } from "$lib/auth/auth";

  onMount(() => void logout());
</script>

<h1>Logout</h1>
