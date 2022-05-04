<script lang="ts">
  import type { User } from "@modules/web-api-client/src/generated/graphql";

  export let me: User | undefined;
</script>

{#if me}
  <img src={me.gravatar} alt="{me.nickname ?? 'user'}'s avatar" />
  <p>{me.nickname}</p>
{:else}
  <p>User not found</p>
{/if}
