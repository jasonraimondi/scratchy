<script lang="ts">
  import { redirectIfAuthenticated } from "$lib/auth/redirect";
  import LoginForm from "$ui/forms/LoginForm.svelte";

  redirectIfAuthenticated();
</script>

<LoginForm />
