<script lang="ts">
  import { Skull } from 'lucide-svelte'
  import type { RouterOutput } from "$lib/api/trpc";

  export let data: {
    prints: RouterOutput["print"]["list"];
  };
</script>

<svelte:head>
  <title>{import.meta.env.VITE_APP}</title>
</svelte:head>

<div>
  <h1>The Landing Page</h1>
  <h3 class="subtitle">Needs some marketing content</h3>
  <Skull size={36} />
</div>

<ul class="prints-gallery">
  {#each data.prints.items as print}
    <li>
      <a href={`/prints/${print.slug}`}>
        <img src={print.url} alt={print.description}/>
        <p>{print.title}</p>
      </a>
    </li>
  {/each}
</ul>

{#if data.prints.nextCursor}
  <a class="button" href="?cursor={data.prints.nextCursor}">Next Page</a>
{/if}

<style lang="postcss">
  .prints-gallery {
    display: grid;
    grid-template-columns: 1fr;

    @media (--small) {
      grid-template-columns: 1fr 1fr;
    }

    @media (--large) {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }
  }
</style>