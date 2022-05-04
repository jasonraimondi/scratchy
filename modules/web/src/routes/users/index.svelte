<script lang="ts">
  import UserCard from "$ui/UserCard.svelte";
  import type { User } from "@modules/web-api-client/src/generated/graphql";

  export let users: User[] = [];
  export let cursorId: string;
</script>

<ul>
  {#each users as user}
    <li>
      <a href={`/users/${user.id}`}>
        <UserCard {user} />
      </a>
    </li>
  {/each}
</ul>

{#if cursorId}
  <a class="button" href="?cursorId={cursorId}">Next Page</a>
{/if}
