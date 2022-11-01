<script lang="ts">
  import type { User } from "$api/graphql";

  export let data: {
    user: User;
  }
</script>

<p>{data.user.nickname}</p>
<p>{data.user.email}</p>
<p>{data.user.gravatar}</p>
