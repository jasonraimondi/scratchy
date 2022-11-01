<script lang="ts">
  import { validateForm } from "@jmondi/form-validator";

  import { registerSchema } from "$ui/forms/schema";
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

  async function register() {
    await graphQLSdk.Register({ input: data });
    notify.success({
      title: "Huzzah!!",
      message: "Go check your inbox for to confirm your email!",
      ttl: 25 * 1000,
    });
    await goto("/register_success");
  }

  async function submit() {
    errors = await validateForm({ schema: registerSchema, data });
    if (!errors) {
      await register().catch(error => {
        if (error.message.includes("duplicate emails")) {
          errors = {
            email: "This email has already been taken",
          };
        } else {
          errors = {
            global: error.message,
          };
        }
      });
    }
  }
</script>

<div class="centered-form">
  <h1>Register</h1>

  <form on:submit|preventDefault={submit} data-test="register-form">
    <OAuthLogins/>

    {#if errors?.global}<span class="error">{errors.global}</span>{/if}

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
      <label for="email">Name</label>
      {#if errors?.nickname}<span class="error">{errors.nickname}</span>{/if}
      <input
          id="nickname"
          name="nickname"
          type="text"
          placeholder="Johnny Appleseed"
          aria-label="nickname"
          aria-required="true"
          bind:value={data.nickname}
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
