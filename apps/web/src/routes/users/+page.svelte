<script lang="ts">
  import UserCard from "$ui/UserCard.svelte";
  import type { User } from "@lib/web-api-client/src/generated/graphql";

  /** @type {import('./$types').PageData} */
  export let data: {
    users: User[];
    cursorId: string;
  };
</script>

<ul>
  {#each data.users as user}
    <li>
      <a href={`/users/${user.id}`}>
        <UserCard {user} />
      </a>
    </li>
  {/each}
</ul>

{#if data.cursorId}
  <a class="button" href="?cursorId={data.cursorId}">Next Page</a>
{/if}
