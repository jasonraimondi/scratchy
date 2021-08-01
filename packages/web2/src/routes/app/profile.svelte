<script lang="ts">
  import { graphQLSdk } from "$lib/api/api_sdk";

  const me = graphQLSdk.Me();
</script>

{#await me}
  Waiting...
{:then res}
  <p>{res.me.name}</p>
  <p>{res.me.email}</p>
  <p>{res.me.firstName}</p>
{:catch error}
  {JSON.stringify(error)}
{/await}
