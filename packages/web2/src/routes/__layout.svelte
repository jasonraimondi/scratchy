<script lang="ts">
	import 'normalize.css/normalize.css';
	import '../app.pcss';

	import Notifications from '$lib/notifications/Notifications.svelte';
	import Header from '$lib/layouts/Header.svelte';
	import DebugBar from '$lib/debug_bar/DebugBar.svelte';

	// async function checkAuth() {
	//   const { notify } = import("$lib/notifications/notification.service");
	//   const { isAuthenticated, refreshToken } = import("$lib/auth/auth");
	//   const isExpired = !isAuthenticated();
	//
	//   if (isPrivate && isExpired) {
	//     notify.info("is private and is expired, running token refresh");
	//     if (await refreshToken()) {
	//       notify.info("It refreshed successfully");
	//     } else {
	//       const { goto } = import("$app/navigation");
	//       await goto("/login");
	//     }
	//   }
	// }
</script>

<Notifications />

<Header />

<main>
	<slot />
</main>

<DebugBar />

<style lang="postcss">
	main {
		height: 100%;
	}
</style>
