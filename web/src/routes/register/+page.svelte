<script lang="ts">
  import RegisterForm from "$ui/forms/RegisterForm.svelte";
  import { redirectIfAuthenticated } from "$lib/auth/redirect";

  redirectIfAuthenticated();
</script>

<RegisterForm />
