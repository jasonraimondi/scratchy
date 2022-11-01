<script lang="ts">
  import type { ListPrintsAvailableQuery } from "$api/graphql";

  export let data: {
    print: ListPrintsAvailableQuery["listPrintsAvailable"][number];
  };
</script>

<h1>{data.print.title}</h1>
<img src={data.print.url} alt={data.print.description} />
<p>{data.print.description}</p>
