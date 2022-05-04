<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { graphQLSdk } from "$lib/api/api_sdk";
  import UpdatePasswordFromToken from "$ui/forms/ResetPasswordForm.svelte";
  import { notify } from "$ui/notifications/notification.service";
  import { emailConfirmationSchema } from "$ui/forms/schema";
  import { validateForm } from "@jmondi/form-validator";

  const input = {
    token: $page.url.searchParams.get("u") as string,
    email: $page.url.searchParams.get("e") as string,
  };

  onMount(async () => {
    const errors = await validateForm({ schema: emailConfirmationSchema, data: input });

    if (errors) {
      notify.error("Invalid Token");
      await goto("/");
      return;
    }

    try {
      await graphQLSdk.ValidateForgotPasswordToken({ input });
    } catch (e) {
      notify.error("Invalid Token");
      await goto("/");
    }
  });
</script>

<UpdatePasswordFromToken token={input.token} email={input.email} />
