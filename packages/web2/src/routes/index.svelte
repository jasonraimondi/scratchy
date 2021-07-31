<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#await promise}
  <p>waiting for the promise to resolve...</p>
{:then res}
  <p>{res.user.email}</p>
{:catch error}
  <p>Something went wrong: {error.message}</p>
{/await}

<script lang="ts">
  import { graphQLSdk } from "$lib/api/api_sdk";

  const promise = graphQLSdk.User({ email: "jason@raimondi.us" });
</script>

<style lang="postcss">
  p {
      color: green;
  }
</style>