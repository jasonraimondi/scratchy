<script lang="ts">
  import { redirectIfAuthenticated } from "$lib/auth/redirect";
  import LoginForm from "$lib/auth/login_form.svelte";

  redirectIfAuthenticated();
</script>

<LoginForm />
