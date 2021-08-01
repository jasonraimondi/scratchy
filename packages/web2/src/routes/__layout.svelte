<Notifications />

<Header />

<main>
	<h1>Current User Id: {$currentUserStore?.id}</h1>
	<slot />
</main>

<DebugBar />

<script lang="ts">
	import "../app.pcss";
	import Notifications from "$lib/notifications/Notifications.svelte";
	import Header from "$lib/layouts/Header.svelte";
	import DebugBar from "$lib/debug_bar/DebugBar.svelte";
	import { currentUserStore } from "$lib/auth/current_user";
</script>
