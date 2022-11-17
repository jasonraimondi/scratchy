<script lang="ts">
  import type { RouterOutput } from "$lib/api/trpc";

  export let data: {
    print: RouterOutput["print"]["get"];
  };
</script>

<h1>{data.print.title}</h1>
<img src={data.print.url} alt={data.print.description} />
<p>{data.print.description}</p>
