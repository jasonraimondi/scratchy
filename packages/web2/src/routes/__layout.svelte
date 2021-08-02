<Notifications />

<Header />

<main>
  <slot />
</main>

<DebugBar />

<style>
    main {
        height: 100%;
    }
</style>

<script lang="ts">
  import "normalize.css/normalize.css";
  import "../app.pcss";

  import Notifications from "$lib/notifications/Notifications.svelte";
  import Header from "$lib/layouts/Header.svelte";
  import DebugBar from "$lib/debug_bar/DebugBar.svelte";

  import { io } from "socket.io-client";
  import { onMount } from "svelte";
  import { currentUserStore } from "$lib/auth/current_user";

  onMount(() => {
    const socket = io({
      path: "/api/socket.io",
      // transports: ["websocket", "polling"]
    });

    let heartbeat;

    socket.on("connect", () => {
      console.log("I CONNECTED!!", socket.id);
      heartbeat = setInterval(() => socket.emit("appear", { userId: $currentUserStore.id }), 2000);
    });

    socket.on("events", (data) => {
      console.log("event", data);
    });
    socket.on("exception", (data) => {
      console.log("event", data);
    });
    socket.on("disconnect", () => {
      console.log("Disconnected");
      if (heartbeat) clearInterval(heartbeat);
    });
  });
</script>
