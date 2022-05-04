<script lang="ts">
  import { graphQLSdk } from "$lib/api/api_sdk";
  import { accessTokenStore } from "$lib/auth/access_token";

  const userId = $accessTokenStore?.decoded?.userId;
</script>

<a href="/app/uploads/new">New Upload</a>

{#if userId}
  {#await graphQLSdk.FileUploads({ input: { userId } })}
    <p>waiting for the promise to resolve...</p>
  {:then res}
    {JSON.stringify(res)}
    <ul>
      {#each res.fileUploads as upload}
        <li>
          <a href={`/app/uploads/${upload.id}`}>
            <img width="250" src={upload.url} alt="" />
          </a>
          <p>{upload.id}</p>
        </li>
      {/each}
    </ul>
  {:catch error}
    <p>Something went wrong: {error.message}</p>
  {/await}
{/if}
