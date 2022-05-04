<script lang="ts">
  import type { Book } from "@modules/web-api-client/src/generated/graphql";
  import { validateForm } from "@jmondi/form-validator";

  import { graphQLSdk } from "$lib/api/api_sdk";
  import { createChapterSchema } from "$ui/forms/schema";
  import { currentUserStore } from "$lib/auth/current_user";
  import { notify } from "$ui/notifications/notification.service";
  import { goto } from "$app/navigation";

  export let book: Book;

  let errors: Record<string, string> | undefined;

  let chapterForm = {
    content: "",
    userId: $currentUserStore?.id ?? "",
    bookId: book.id,
  };

  async function submit() {
    errors = await validateForm({ schema: createChapterSchema, data: chapterForm });

    if (errors) return console.log(errors);

    const success = await graphQLSdk.CreateChapter({ input: chapterForm });

    if (success) {
      notify.success("Chapter Created!");
      chapterForm = { ...chapterForm, content: "" };
      await goto(`/app/my_books/${book.id}/chapters`);
    }
  }
</script>

<div>
  <form on:submit|preventDefault={submit} data-test="login-form">
    <div class="form-control">
      <label for="content">Content</label>
      {#if errors?.content}<span class="error">{errors.content}</span>{/if}
      <textarea
        id="content"
        name="content"
        type="text"
        placeholder="A most special book ever."
        aria-label="content"
        aria-required="true"
        style="margin-bottom: 0;"
        bind:value={chapterForm.content}
      />
    </div>

    <div class="form-submit">
      <button type="submit">Submit</button>
    </div>
  </form>
</div>

<style>
  .form-submit {
    margin-top: 1rem;
  }
</style>
