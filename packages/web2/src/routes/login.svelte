<script lang="ts">
  import { get } from "svelte/store";
  import { loginFormState, loginFormSchema } from "$lib/auth/login_form";
  import { login } from "$lib/auth/auth";
  import { redirectIfAuthenticated } from "$lib/auth/redirect";

  redirectIfAuthenticated();

  async function submit() {
    const input = get(loginFormState);
    const { error, value } = loginFormSchema.validate(input);

    if (error) {
      return;
    }

    await login(value);
  }
</script>

<div class="centered-form">
  <form on:submit|preventDefault="{submit}">
    <div class="form-control">
      <label for="email">Email:</label>
      <input id="email"
             name="email"
             type="email"
             placeholder="johnny.appleseed@example.com"
             required="required"
             aria-label="email"
             aria-required="true"
             bind:value={$loginFormState.email} />
    </div>

    <div class="form-control">
      <label for="password">Password:</label>
      <input id="password"
             name="password"
             type="password"
             placeholder="***************"
             required="required"
             aria-label="password"
             aria-required="true"
             bind:value={$loginFormState.password} />
    </div>

    <div class="form-control">
      <label for="rememberMe">Remember Me:</label>
      <input id="rememberMe" type="checkbox" bind:checked={$loginFormState.rememberMe}>
    </div>

    <button type="submit">Submit</button>
  </form>
</div>


