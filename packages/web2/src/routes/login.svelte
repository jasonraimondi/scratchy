<script lang="ts">
	import { redirectIfAuthenticated } from '$lib/auth/redirect';
	import LoginForm from '$lib/auth/LoginForm.svelte';

	redirectIfAuthenticated();
</script>

<LoginForm />
