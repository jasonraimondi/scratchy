<script lang="ts">
  import { beforeUpdate } from "svelte";
  import { checkAuth } from "$lib/check_auth";

  beforeUpdate(() => void checkAuth());
</script>

<slot />
