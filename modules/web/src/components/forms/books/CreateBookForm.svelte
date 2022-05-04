<script lang="ts">
  import { validateForm } from "@jmondi/form-validator";
  import { BookCreateInput, BookStatus } from "@modules/web-api-client/src/generated/graphql";

  import { graphQLSdk } from "$lib/api/api_sdk";
  import { createBookSchema } from "$ui/forms/schema";
  import { currentUserStore } from "$lib/auth/current_user";
  import { notify } from "$ui/notifications/notification.service";
  import { goto } from "$app/navigation";

  let errors: Record<string, string> | undefined;

  const bookForm: BookCreateInput = {
    isPrivate: false,
    title: "",
    subtitle: "",
    status: BookStatus.Draft,
    userId: $currentUserStore?.id ?? "",
  };

  async function submit() {
    bookForm.isPrivate = bookForm.isPrivate === "true";
    errors = await validateForm({ schema: createBookSchema, data: bookForm });
    const success = await graphQLSdk.CreateBook({ input: bookForm });
    if (success) {
      notify.success("Book Created!");
      await goto("/app/my_books");
    }
  }
</script>

<div>
  <form on:submit|preventDefault={submit} data-test="login-form">
    <div class="form-control">
      <label for="title">Title</label>
      {#if errors?.title}<span class="error">{errors.title}</span>{/if}
      <input
        id="title"
        name="title"
        type="text"
        placeholder="My Fancy Book Title"
        aria-label="title"
        aria-required="true"
        style="margin-bottom: 0;"
        bind:value={bookForm.title}
      />
    </div>

    <div class="form-control">
      <label for="subtitle">Subtitle</label>
      {#if errors?.subtitle}<span class="error">{errors.subtitle}</span>{/if}
      <textarea
        id="subtitle"
        name="subtitle"
        type="text"
        placeholder="A most special book ever."
        aria-label="subtitle"
        aria-required="true"
        style="margin-bottom: 0;"
        bind:value={bookForm.subtitle}
      />
    </div>

    <div class="form-control">
      <label for="status">BookStatus</label>
      {#if errors?.status}<span class="error">{errors.status}</span>{/if}
      <select
        id="status"
        name="status"
        aria-label="status"
        aria-required="true"
        style="margin-bottom: 0;"
        bind:value={bookForm.status}
      >
        {#each Object.entries(BookStatus) as [key, value]}
          <option {value}>{key}</option>
        {/each}
      </select>
    </div>

    <label for="isPrivate"
      >Private
      {#if errors?.isPrivate}<span class="error">{errors.isPrivate}</span>{/if}
      <input
        id="isPrivate"
        name="isPrivate"
        type="checkbox"
        aria-label="isPrivate"
        aria-required="true"
        style="margin-bottom: 0;"
        bind:value={bookForm.isPrivate}
      />
    </label>

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
