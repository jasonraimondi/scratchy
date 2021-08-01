<Notifications />

<Header />

<main>
	<h1>Current User Id: {$currentUserStore?.id}</h1>
	<slot />
</main>

<script lang="ts">
	import "../app.pcss";
	import Notifications from "$lib/notifications/Notifications.svelte";
	import Header from "$lib/layouts/Header.svelte";
	import { currentUserStore } from "$lib/auth/current_user";
</script>
