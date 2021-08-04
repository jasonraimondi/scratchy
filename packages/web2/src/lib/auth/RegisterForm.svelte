<script lang="ts">
  import { registerFormSchema } from "$lib/auth/forms";
  import { validateForm } from "$lib/utils/form_validation";
  import { graphQLSdk } from "$lib/api/api_sdk";

  let errors: Record<string, string> = {};

  const data = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  };

  async function submit() {
    errors = await validateForm({ schema: registerFormSchema, data });
    if (!errors) await graphQLSdk.Register({ input: data });
  }
</script>

<div class="centered-form">
  <form on:submit|preventDefault="{submit}">

    <div class="form-control">
      <label for="firstName">First:</label>
      {#if errors?.firstName}<span class="error">{errors.firstName}</span>{/if}
      <input id="firstName"
             name="firstName"
             type="text"
             placeholder="Johnny"
             required="required"
             aria-label="firstName"
             aria-required="true"
             bind:value={data.firstName} />
    </div>

    <div class="form-control">
      <label for="lastName">Last:</label>
      {#if errors?.lastName}<span class="error">{errors.lastName}</span>{/if}
      <input id="lastName"
             name="lastName"
             type="text"
             placeholder="Appleseed"
             required="required"
             aria-label="lastName"
             aria-required="true"
             bind:value={data.lastName} />
    </div>

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
             bind:value={data.email} />
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
             bind:value={data.password} />
    </div>

    <button type="submit">Submit</button>
  </form>
</div>

<style>
  .error {
      font-size: 0.8em;
  }
</style>