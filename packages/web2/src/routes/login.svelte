<script lang="ts">
  import { get } from "svelte/store";
  import { loginFormState, loginFormSchema } from "$lib/auth/login_form";
  import { redirectIfAuthenticated } from "$lib/auth/redirect_if_authenticated";

  redirectIfAuthenticated();

  async function handleSubmit() {
    const input = get(loginFormState);
    const { error, value } = loginFormSchema.validate(input);
    console.log("LoginFormData", { error, value });

    if (!error) {
      const { login } = await import("$lib/auth/auth");
      await login(value);
      return;
    }

    // there is an error, handle it
  }

</script>
<div class="centered-form">
  <form on:submit|preventDefault="{handleSubmit}">
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


