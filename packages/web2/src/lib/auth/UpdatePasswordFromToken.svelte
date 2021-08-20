<script lang="ts">
  import { goto } from "$app/navigation";
  import { validateForm } from "@jmondi/form-validator";
  import { graphQLSdk } from "$lib/api/api_sdk";
  import { notify } from "$lib/notifications/notification.service";
  import { updatePasswordFromTokenSchema } from "$lib/utils/forms";
  import { setAccessToken } from "$lib/auth/auth";

  export let email: string;
  export let token: string;

  let errors: Record<string, string> = {};

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
      await goto("/app/dashboard");
    }
  }
</script>

<div class="centered-form">
  <form on:submit|preventDefault="{submit}" data-test="forgot-password-form">
    <div class="form-control">
      <label for="password">Password</label>
      {#if errors?.password}<span class="error">{errors.password}</span>{/if}
      <input id="password"
             name="password"
             type="password"
             placeholder="********"
             required="required"
             aria-label="password"
             aria-required="true"
             bind:value={formData.password} />
    </div>
    <div class="form-submit">
      <button type="submit">Submit</button>
    </div>
  </form>
</div>
