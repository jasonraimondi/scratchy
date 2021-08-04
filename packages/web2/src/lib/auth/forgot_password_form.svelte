<script lang="ts">
  import { forgotPasswordForm } from "$lib/utils/forms";
  import { validateForm } from "$lib/utils/form_validation";
  import { graphQLSdk } from "$lib/api/api_sdk";

  let errors: Record<string, string> = {};
  const formData = {
    email: "",
  };

  async function submit() {
    errors = await validateForm({ schema: forgotPasswordForm, data: formData });
    if (!errors) await graphQLSdk.SendForgotPasswordEmail({ email: formData.email });
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
             bind:value={formData.email} />
    </div>
    <button type="submit">Submit</button>
  </form>
</div>
