<script lang="ts">
  import { Skull } from 'lucide-svelte'
</script>

<svelte:head>
  <title>{import.meta.env.VITE_APP}</title>
</svelte:head>

<div>
  <h1>The Landing Page</h1>
  <h3 class="subtitle">Needs some marketing content</h3>
  <Skull size={36} />
</div>
