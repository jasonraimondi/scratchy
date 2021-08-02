<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#await promise}
  <p>waiting for the promise to resolve...</p>
{:then res}
  {#each res.users.data as user}
    <p>{JSON.stringify(user)}</p>
  {/each}
{:catch error}
  <p>Something went wrong: {error.message}</p>
{/await}

<h1>Am I inside index {isAuth ? "Yes" : "no"} {JSON.stringify(isAuth)}</h1>


<script lang="ts">
  export let isAuth;

  import { graphQLSdk } from "$lib/api/api_sdk";

  const promise = graphQLSdk.Users();
</script>

<style lang="postcss">
  p {
      color: green;
  }
</style>