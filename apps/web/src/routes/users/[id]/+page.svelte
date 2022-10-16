<script lang="ts">
  import type { User } from "@lib/web-api-client/src/generated/graphql";

  export let data: {
    user: User;
  }
</script>

<p>{data.user.nickname}</p>
<p>{data.user.email}</p>
<p>{data.user.gravatar}</p>
