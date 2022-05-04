<script lang="ts">
  import type { User } from "@modules/web-api-client/src/generated/graphql";

  export let user: User;
</script>

{JSON.stringify(user)}
