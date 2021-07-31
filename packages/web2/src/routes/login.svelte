<script lang="ts">
  import { get, writable } from "svelte/store";

  const formData = writable({
    email: "",
    password: "",
    rememberMe: true,
  });

  import * as yup from "yup";
  import { graphQLSdk } from "$lib/api/api_sdk";

  let loginForm = yup.object().shape({
    email: yup.string().email(),
    password: yup.string().min(8),
    rememberMe: yup.boolean(),
  });

  let errors = [];

  async function handleSubmit() {
    const input = get(formData);

    try {
      await loginForm.validate(input)
    } catch (e) {
      errors = e.errors;
      return;
    }

    await graphQLSdk.Login({ input });
  }
</script>


<div class="centered-form">
  <form on:submit|preventDefault="{handleSubmit}">
    <div class="form-control">
      {#each errors as error}
        <p>{error}</p>
      {/each}
    </div>
    <div class="form-control">
      <label for="email">Email:</label>
      <input id="email"
             name="email"
             type="email"
             placeholder="johnny.appleseed@example.com"
             required="required"
             aria-label="email"
             aria-required="true"
             bind:value={$formData.email} />
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
             bind:value={$formData.password} />
    </div>

    <div class="form-control">
      <label for="rememberMe">Remember Me:</label>
      <input id="rememberMe" type="checkbox" bind:checked={$formData.rememberMe}>
    </div>

    <button type="submit">Submit</button>
  </form>
</div>


