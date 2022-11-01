<script lang="ts">
  import { graphQLSdk } from "$lib/api/api_sdk";
  import { browser } from "$app/environment";

  const me = async () => {
    return await graphQLSdk.Me()
  };

</script>

{#if browser}
  {#await me()}
    <p>Loading...</p>
  {:then res}
    <img src={res.me.gravatar} alt="{res.me.nickname ?? 'user'}'s avatar"/>
    <p>{res.me.nickname}</p>
  {:catch error}
    <p>Something went wrong: {error.message}</p>
  {/await}
{/if}

