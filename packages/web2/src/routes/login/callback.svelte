<script lang="ts">
	import { page } from '$app/stores';
	import { setAccessToken } from '$lib/auth/auth';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';

	type LoginResponse = {
		accessToken: string;
		user: any;
		accessTokenExpiresAt: number;
		refreshTokenExpiresAt?: number;
	};

	if (browser) {
		let encodedToken: string = $page.query.get('encoded_token');
		encodedToken = atob(encodedToken);
		const decodedToken: LoginResponse = JSON.parse(encodedToken);
		setAccessToken(decodedToken.accessToken);
	}

	onMount(() => {
		goto('/app/dashboard');
	});
</script>

Redirecting...
