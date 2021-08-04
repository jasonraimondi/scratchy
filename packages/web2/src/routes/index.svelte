<h1>Welcome to SvelteKit</h1>

{#await graphQLSdk.Users()}
  <p>waiting for the promise to resolve...</p>
{:then res}
  {#each res.users.data as user}
    <p>{JSON.stringify(user)}</p>
  {/each}
{:catch error}
  <p>Something went wrong: {error.message}</p>
{/await}

<script lang="ts">
  import { graphQLSdk } from "$lib/api/api_sdk";
</script>
