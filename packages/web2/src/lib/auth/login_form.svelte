<script lang="ts">
  import { loginFormSchema } from "$lib/utils/forms";
  import { login } from "$lib/auth/auth";
  import { validateForm } from "$lib/utils/form_validation";

  let errors: Record<string, string> = {};

  const loginForm = {
    email: "",
    password: "",
    rememberMe: false,
  };

  async function submit() {
    errors = await validateForm({ schema: loginFormSchema, data: loginForm });
    if (!errors) await login(loginForm);
  }
</script>

<div class="centered-form">
  <form on:submit|preventDefault="{submit}">
    <div class="form-control">
      <label for="email">Email:</label>
      {#if errors?.email}<span class="error">{errors.email}</span>{/if}
      <input id="email"
             name="email"
             type="email"
             placeholder="johnny.appleseed@example.com"
             required="required"
             aria-label="email"
             aria-required="true"
             bind:value={loginForm.email} />
    </div>

    <div class="form-control">
      <label for="password">Password:</label>
      {#if errors?.password}<span class="error">{errors.password}</span>{/if}
      <input id="password"
             name="password"
             type="password"
             placeholder="***************"
             required="required"
             aria-label="password"
             aria-required="true"
             bind:value={loginForm.password} />
    </div>

    <div class="form-control">
      <label for="rememberMe">Remember Me:</label>
      <input id="rememberMe" type="checkbox" bind:checked={loginForm.rememberMe}>
    </div>

    <button type="submit">Submit</button>
  </form>
</div>

<style>
  .error {
      font-size: 0.8em;
  }
</style>