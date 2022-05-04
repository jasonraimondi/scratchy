<script lang="ts">
  import type { PresignedUrlInput } from "@modules/web-api-client/src/generated/graphql";
  import { validateForm } from "@jmondi/form-validator";
  import { goto } from "$app/navigation";
  import { graphQLSdk } from "$lib/api/api_sdk";
  import { fileUploadSchema } from "$ui/forms/schema";
  import { notify } from "$ui/notifications/notification.service";

  let errors: Record<string, string> | undefined;
  let preview: string | ArrayBuffer = "https://placeholder.pics/svg/300";

  const init: PresignedUrlInput = { fileName: "", mimeType: "", type: "avatar" };

  let presignedUrlInput: PresignedUrlInput = init;

  let fileUploadInput = {
    file: undefined,
  };

  // @todo add proper typings
  function onFileSelected(e: any) {
    fileUploadInput.file = e.target.files[0];
    presignedUrlInput.fileName = e.target.files?.[0].name;
    presignedUrlInput.mimeType = e.target.files?.[0].type;
    const reader = new FileReader();
    if (fileUploadInput.file) reader.readAsDataURL(fileUploadInput.file);
    reader.onload = ({ target }) => {
      if (target?.result) preview = target.result;
    };
  }

  async function onSubmit() {
    errors = await validateForm({ schema: fileUploadSchema, data: presignedUrlInput });

    if (errors) return notify.error(JSON.stringify(errors));

    const {
      presignedUrl: { url, fields },
    } = await graphQLSdk.PresignedUrl({ input: presignedUrlInput });

    console.log({ url, fields });

    const body = new FormData();

    if (!fileUploadInput.file) return notify.error("Missing file");

    body.append("file", fileUploadInput.file);

    for (const [key, value] of Object.entries(fields)) {
      if (typeof value === "string" || value instanceof Blob) body.append(key, value);
    }

    const upload = await fetch(url, { method: "POST", body });

    if (upload.ok) notify.success("Uploaded successfully!");

    presignedUrlInput = init;

    await goto("/app/uploads");
  }
</script>

{#if preview}
  <img class="preview" src={preview.toString()} alt="preview of upload" />
{:else}
  <p>file upload preview here</p>
{/if}

<form on:submit|preventDefault={onSubmit}>
  <div class="form-control">
    <label for="file">File:</label>
    <input id="file" type="file" name="file" on:change={onFileSelected} bind:this={fileUploadInput.file} />
  </div>

  <button type="submit">Upload</button>
</form>
