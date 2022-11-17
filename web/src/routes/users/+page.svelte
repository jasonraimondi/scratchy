<script lang="ts">
  import UserCard from "$ui/UserCard.svelte";
  import type { User } from "$api/graphql";
  import type { RouterOutput } from "$lib/api/trpc";

  export let data: {
    users: RouterOutput["user"]["list"];
  };
</script>

<ul>
  {#each data.users.items as user}
    <li>
      <a href={`/users/${user.id}`}>
        <UserCard {user} />
      </a>
    </li>
  {/each}
</ul>

{#if data.users.nextCursor}
  <a class="button" href="?cursor={data.users.nextCursor}">Next Page</a>
{/if}
