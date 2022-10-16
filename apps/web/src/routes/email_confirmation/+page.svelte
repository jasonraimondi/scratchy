<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { graphQLSdk } from "$lib/api/api_sdk";
  import { setAccessToken } from "$lib/auth/auth";
  import { notify } from "$ui/notifications/notification.service";
  import { validateForm } from "@jmondi/form-validator";
  import { emailConfirmationSchema } from "$ui/forms/schema";

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
      const { verifyEmailConfirmation } = await graphQLSdk.VerifyEmailConfirmation({ input });
      setAccessToken(verifyEmailConfirmation.accessToken);
      notify.success("Email Confirmed!");
      await goto("/app");
    } catch (e) {
      notify.error("Invalid Token");
      await goto("/");
    }
  });
</script>

Verifying Email
