<Notifications />

<Header />

<main>
	<slot />
</main>

<Debug />

<script lang="ts">
	import "../app.pcss";
	import Notifications from "$lib/notifications/Notifications.svelte";
	import Header from "$lib/layouts/Header.svelte";
	import Debug from "$lib/debug/Debug.svelte";
</script>
