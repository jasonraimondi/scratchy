<script lang="ts">
  import { registerSchema } from "$ui/forms/schema";
  import { validateForm } from "@jmondi/form-validator";
  import { graphQLSdk } from "$lib/api/api_sdk";
  import { goto } from "$app/navigation";
  import OAuthLogins from "$ui/auth/OAuthLogins.svelte";
  import { notify } from "$ui/notifications/notification.service";

  // errors are key value, where key is the form name, and value is the error message
  let errors: Record<string, string> | undefined;

  const data = {
    email: "",
    password: "",
    nickname: null,
  };

  async function submit() {
    errors = await validateForm({ schema: registerSchema, data });
    if (!errors) {
      await graphQLSdk.Register({ input: data });
      notify.success({
        title: "Huzzah!!",
        message: "Go check your inbox for to confirm your email!",
        ttl: 25 * 1000,
      });
      await goto("/register_success");
    }
  }
</script>

<div class="centered-form">
  <h1>Register</h1>

  <form on:submit|preventDefault={submit} data-test="register-form">
    <OAuthLogins />

    <div class="form-control">
      <label for="email">Email</label>
      {#if errors?.email}<span class="error">{errors.email}</span>{/if}
      <input
        id="email"
        name="email"
        type="email"
        placeholder="johnny.appleseed@example.com"
        aria-label="email"
        aria-required="true"
        bind:value={data.email}
      />
    </div>

    <div class="form-control">
      <label for="password">Password</label>
      {#if errors?.password}<span class="error">{errors.password}</span>{/if}
      <input
        id="password"
        name="password"
        type="password"
        placeholder="***************"
        aria-label="password"
        aria-required="true"
        bind:value={data.password}
      />
    </div>

    <div class="form-submit">
      <button type="submit">Submit</button>
    </div>
  </form>
</div>
