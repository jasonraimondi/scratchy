<script lang="ts">
  import type { FileUpload } from "@modules/web-api-client/src/generated/graphql";

  export let upload: FileUpload;
</script>

<div>
  <img src={upload.url} alt="" />
  <p>{upload.originalName}</p>
</div>

<style>
  img {
    width: 100%;
    max-width: 250px;
  }
</style>
