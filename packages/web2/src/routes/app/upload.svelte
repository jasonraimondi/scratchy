<script lang="ts">
  import { apiHttpClient } from "$lib/api/http_client";

  let avatar: string | ArrayBuffer;
  let input;

  function onFileSelected(e) {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = e => {
      avatar = e.target.result;
    };
  }

</script>

<h1>Upload Image</h1>

{#if avatar}
  <img class="avatar" src="{avatar}" alt="d" />
{:else}
  <img class="avatar" src="https://placehold.it/250" alt="" />
{/if}


<button on:click={()=>{input.click()}}>Upload</button>
<div on:click={()=>{input.click()}}>Choose Image</div>

<input style="display:none"
       type="file"
       accept=".jpg, .jpeg, .png"
       on:change={(e)=>onFileSelected(e)}
       bind:this={input}>

{#await apiHttpClient.post("/presigned_url")}
{:then res}
  {res.url}
{/await}

