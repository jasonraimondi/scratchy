<script lang="ts">
  import type { Book } from "@modules/web-api-client/src/generated/graphql";

  export let book: Book;
</script>

<div class="book {book.status}">
  <h4 class="title">{book.title}</h4>
  <p class="subtitle">{book.subtitle}</p>
</div>

<style lang="postcss">
  .book {
    display: inline-block;
    width: 100%;
    padding: 1rem;

    .title {
      font-size: 1em;
    }

    .subtitle {
      font-size: 0.8em;
    }

    &.draft {
      background-color: var(--colors-gray-200);
    }

    &.working {
      background-color: var(--colors-teal-200);
    }
  }
</style>
