<script lang="ts">
  import { browser } from "$app/environment";

  import { trpc } from "$lib/api/trpc";
</script>

{#if browser}
  {#await trpc.me.me.query({ gravatarSize: 100 })}
    <p>Loading...</p>
  {:then me}
    <img src={me.gravatar} alt="{me.nickname ?? 'user'}'s avatar"/>
    <p>{me.nickname}</p>
  {:catch error}
    <p>Something went wrong: {error.message}</p>
  {/await}
{/if}

