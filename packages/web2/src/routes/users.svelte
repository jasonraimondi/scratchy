<!--<script lang="ts">-->
<!--	import { graphQLSdk } from '$lib/api/api_sdk';-->
<!--</script>-->
<!---->
<!--{#await graphQLSdk.Users()}-->
<!--	<p>waiting for the promise to resolve...</p>-->
<!--{:then res}-->
<!--	{#each res.users.data as user}-->
<!--		<pre>{JSON.stringify(user, null, 2)}</pre>-->
<!--	{/each}-->
<!--{:catch error}-->
<!--	<p>Something went wrong: {error.message}</p>-->
<!--{/await}-->
