<script lang="ts">
  import { goto } from "$app/navigation";
  import { forgotPasswordSchema } from "$ui/forms/schema";
  import { validateForm } from "@jmondi/form-validator";
  import { notify } from "$ui/notifications/notification.service";
  import { trpc } from "$lib/api/trpc";

  let errors: Record<string, string> | undefined;
  const formData = {
    email: "",
  };

  async function submit() {
    errors = await validateForm({ schema: forgotPasswordSchema, data: formData });
    if (!errors) {
      await trpc.forgotPassword.sendForgotPasswordEmail.mutate ({ email: formData.email });
      notify.success("It sent!");
      await goto("/");
    }
  }
</script>

<div class="centered-form">
  <h1>Reset your password</h1>
  <p>To reset your password, enter the email address you use to sign in.</p>
</div>

<form on:submit|preventDefault={submit} data-test="forgot-password-form">
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
      bind:value={formData.email}
    />
  </div>

  <div class="form-submit">
    <button id="submit" type="submit">Submit</button>
    <a class="back" href="/login">Back to Login</a>
  </div>
</form>
