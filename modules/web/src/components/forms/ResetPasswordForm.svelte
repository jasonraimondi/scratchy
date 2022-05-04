<script lang="ts">
  import { goto } from "$app/navigation";
  import { validateForm } from "@jmondi/form-validator";
  import { graphQLSdk } from "$lib/api/api_sdk";
  import { updatePasswordFromTokenSchema } from "$ui/forms/schema";
  import { setAccessToken } from "$lib/auth/auth";
  import { notify } from "$ui/notifications/notification.service";

  export let email: string;
  export let token: string;

  let errors: Record<string, string> | undefined;

  const formData = {
    password: "",
  };

  async function submit() {
    const input = { email, token, password: formData.password };
    errors = await validateForm({ schema: updatePasswordFromTokenSchema, data: input });
    if (!errors) {
      const { updatePasswordFromToken } = await graphQLSdk.UpdatePasswordFromToken({ input });
      setAccessToken(updatePasswordFromToken.accessToken);
      notify.success("It sent!");
      await goto("/app");
    }
  }
</script>

<div class="centered-form">
  <form on:submit|preventDefault={submit} data-test="reset-password-form">
    <div class="form-control">
      <label for="password">Password</label>
      {#if errors?.password}<span class="error">{errors.password}</span>{/if}
      <input
        id="password"
        name="password"
        type="password"
        placeholder="********"
        aria-label="password"
        aria-required="true"
        bind:value={formData.password}
      />
    </div>
    <div class="form-submit">
      <button id="submit" type="submit">Submit</button>
    </div>
  </form>
</div>
