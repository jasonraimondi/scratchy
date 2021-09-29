<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { graphQLSdk } from '$lib/api/api_sdk';
  import { notify } from '$lib/notifications/notification.service';
  import { VerifyEmailInput } from "$api/graphql";
  import { setAccessToken } from "$lib/auth/auth";

  const input: VerifyEmailInput = {
    token: $page.query.get('u'),
    email: $page.query.get('e')
  };

  onMount(async () => {
    try {
      const { verifyEmailConfirmation } = await graphQLSdk.VerifyEmailConfirmation({ input });
      setAccessToken(verifyEmailConfirmation.accessToken);
      notify.success('Email Confirmed!');
      await goto('/app/dashboard');
    } catch (e) {
      notify.error('Invalid Token');
      await goto('/');
    }
  });
</script>

Verifying Email!!