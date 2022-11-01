<script lang="ts">
  const isDev = import.meta.env.DEV;
</script>

<h1>Verify your email to get going.</h1>

{#if isDev}
  <a href="http://localhost:8025">Mailhog</a>
{/if}
