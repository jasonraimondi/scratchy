<script lang="ts">
	import { beforeUpdate } from 'svelte';

	import { notify } from '$lib/notifications/notification.service';
	import { goto } from '$app/navigation';
	import { isAuthenticated, refreshToken } from '$lib/auth/auth';

	async function checkAuth() {
		if (isAuthenticated()) return;

		notify.info({
      title: 'Your token is expired!',
      message: 'Attempting to refresh it... Let\'s see how this goes',
    });

		if (await refreshToken()) {
			notify.success('It refreshed successfully');
		} else {
			await goto('/login');
		}
	}

	beforeUpdate(async () => {
		await checkAuth();
		console.log('CHECK AUTH DONE');
	});
</script>

<slot />
