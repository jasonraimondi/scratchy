<script lang="ts">
  import { redirectIfAuthenticated } from "$lib/auth/redirect";
  import LoginForm from "$lib/auth/LoginForm.svelte";

  redirectIfAuthenticated();
</script>

<a href="https://scratchy.localdomain/api/oauth2/github">Login w/ Github</a>
<a href="https://scratchy.localdomain/api/oauth2/google">Login w/ Google</a>

<LoginForm />
