<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { setAccessToken } from "$lib/auth/auth";
  import { notify } from "$ui/notifications/notification.service";
  import { validateForm } from "@jmondi/form-validator";
  import { emailConfirmationSchema } from "$ui/forms/schema";
  import { trpc } from "$lib/api/trpc";

  const input = {
    token: $page.url.searchParams.get("token"),
    email: $page.url.searchParams.get("email"),
  };

  onMount(async () => {
    const errors = await validateForm({ schema: emailConfirmationSchema, data: input });

    if (errors) {
      notify.error("Invalid Token");
      await goto("/");
      return;
    }

    try {
      const verifyEmailConfirmation = await trpc.emailConfirmation.verifyEmailConfirmation.mutate(input);
      setAccessToken(verifyEmailConfirmation.accessToken);
      notify.success("Email Confirmed!");
      await goto("/app");
    } catch (e) {
      console.error(e);
      notify.error("Invalid Token");
      await goto("/");
    }
  });
</script>

Verifying Email
