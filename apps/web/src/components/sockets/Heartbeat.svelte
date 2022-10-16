<script lang="ts">
  import { io } from "socket.io-client";
  import { onMount } from "svelte";
  import { currentUserStore } from "$lib/auth/current_user.js";

  onMount(() => {
    const socket = io({
      path: "/api/socket.io",
      // transports: ["websocket", "polling"]
    });

    let heartbeat: number | unknown;

    socket.on("connect", () => {
      console.log("I CONNECTED!!", socket.id);
      heartbeat = setInterval(() => socket.emit("appear", { userId: $currentUserStore?.id }), 5000);
    });

    socket.on("events", data => {
      console.log("event", data);
    });
    socket.on("exception", data => {
      console.log("event", data);
    });
    socket.on("disconnect", () => {
      console.log("Disconnected");
      if (typeof heartbeat === "number") clearInterval(heartbeat);
    });
  });
</script>
