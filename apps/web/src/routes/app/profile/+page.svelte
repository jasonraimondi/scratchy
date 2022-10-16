<script lang="ts">
  import { graphQLSdk } from "$lib/api/api_sdk";
</script>

{#await graphQLSdk.Me()}
  <p>Loading...</p>
{:then res}
  <img src={res.me.gravatar} alt="{res.me.nickname ?? 'user'}'s avatar"/>
  <p>{res.me.nickname}</p>
{:catch error}
  <p>Something went wrong: {error.message}</p>
{/await}
