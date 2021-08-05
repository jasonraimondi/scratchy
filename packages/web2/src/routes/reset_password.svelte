<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import UpdatePasswordFromToken from "$lib/auth/UpdatePasswordFromToken.svelte";
  import { graphQLSdk } from "$lib/api/api_sdk";
  import { notify } from "$lib/notifications/notification.service";

  const input = {
    token: $page.query.get("u"),
    email: $page.query.get("e"),
  }

  onMount(async () => {
    try {
      await graphQLSdk.ValidateForgotPasswordToken({ input });
    } catch (e) {
      notify.error("Invalid Token");
      await goto("/");
    }
  });
</script>

<UpdatePasswordFromToken token={input.token} email={input.email} />

