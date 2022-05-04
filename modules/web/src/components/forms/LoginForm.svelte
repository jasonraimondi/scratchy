<script lang="ts">
  import { validateForm } from "@jmondi/form-validator";

  import { loginSchema } from "$ui/forms/schema";
  import { login } from "$lib/auth/auth";
  import OAuthLogins from "$ui/auth/OAuthLogins.svelte";

  let errors: Record<string, string> | undefined;

  const loginForm = {
    email: "",
    password: "",
    rememberMe: false,
  };

  async function submit() {
    errors = await validateForm({ schema: loginSchema, data: loginForm });
    if (!errors) await login(loginForm);
  }
</script>

<div class="centered-form">
  <h1>Login</h1>

  <form on:submit|preventDefault={submit} data-test="login-form">
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
        style="margin-bottom: 0;"
        bind:value={loginForm.email}
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
        bind:value={loginForm.password}
      />
      <div class="remember-section">
        <a class="forgot-password" href="/forgot_password">Forgot Password?</a>
        <div class="form-control inline">
          <label for="remember-me">Remember Me</label>
          <input id="remember-me" type="checkbox" bind:checked={loginForm.rememberMe} />
        </div>
      </div>
    </div>

    <div class="form-submit">
      <button id="submit" type="submit">Submit</button>
    </div>
  </form>
</div>

<style lang="postcss">
  .forgot-password {
    font-size: 0.8em;
    margin-top: 0.25em;
  }

  .remember-section {
    display: flex;
    justify-content: space-between;

    input,
    label {
      margin-top: 0;
      margin-bottom: 0;
      margin-right: 0.25rem;
    }
  }

  .form-submit {
    margin-top: 1rem;
  }
</style>
