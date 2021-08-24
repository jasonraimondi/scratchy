<script>
	import { io } from 'socket.io-client';
	import { onMount } from 'svelte';
	import { currentUserStore } from '$lib/auth/current_user';

	onMount(() => {
		const socket = io({
			path: '/api/socket.io'
			// transports: ["websocket", "polling"]
		});

		let heartbeat;

		socket.on('connect', () => {
			console.log('I CONNECTED!!', socket.id);
			heartbeat = setInterval(() => socket.emit('appear', { userId: $currentUserStore.id }), 2000);
		});

		socket.on('events', (data) => {
			console.log('event', data);
		});
		socket.on('exception', (data) => {
			console.log('event', data);
		});
		socket.on('disconnect', () => {
			console.log('Disconnected');
			if (heartbeat) clearInterval(heartbeat);
		});
	});
</script>
