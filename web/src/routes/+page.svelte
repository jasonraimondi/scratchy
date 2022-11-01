<script lang="ts">
  import type { AvailablePrintsQuery } from "$api/graphql";

  export let data: {
    listPrintsAvailable: AvailablePrintsQuery["listPrintsAvailable"];
  };

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

<ul class="prints-gallery">
  {#each data.listPrintsAvailable as print}
    <li>
      <a href={`/prints/${print.slug}`}>
        <img src={print.url} alt={print.description}/>
        <p>{print.title}</p>
      </a>
    </li>
  {/each}
</ul>

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