<script lang="ts">
  import type { Book } from "@modules/web-api-client/src/generated/graphql";
  import BookCard from "$ui/BookCard.svelte";

  export let books: Book[] = [];
</script>

{#if books.length}
  <h1>My Books</h1>
  <ul>
    {#each books as book}
      <li class="book">
        <a href={`/app/my_books/${book.id}`}>
          <BookCard {book} />
        </a>
      </li>
    {/each}
  </ul>
{:else}
  <p>You don't have any books!</p>
{/if}

<style lang="postcss">
</style>
