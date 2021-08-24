<script lang="ts">
	import { apiHttpClient } from '$lib/api/http_client';

	let avatar: string | ArrayBuffer;
	let file;
	let input;

	function onFileSelected(e) {
		file = e.target.files[0];
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (e) => {
			avatar = e.target.result;
		};
	}

	async function onSubmit() {
		const { url, fields } = await apiHttpClient.post('/presigned_url', {
			fileName: file?.name,
			type: 'avatar'
		});

		const body = new FormData();

		body.append('file', file);

		Object.entries(fields).forEach(([name, value]) => {
			if (typeof value === 'string' || value instanceof Blob) {
				body.append(name, value);
			}
		});

		const upload = await fetch(url, { method: 'POST', body });

		if (upload.ok) {
			console.log('Uploaded successfully!');
		} else {
			console.error('Upload failed.');
		}
	}
</script>

<h1>Upload Image</h1>

{#if avatar}
	<img class="avatar" src={avatar} alt="d" />
{:else}
	<img class="avatar" src="https://placehold.it/250" alt="" />
{/if}

<form on:submit|preventDefault={onSubmit}>
	<!-- Copy the 'fields' key:values returned by S3Client.generate_presigned_post() -->

	<div class="form-control">
		<label for="file">File:</label>
		<input id="file" type="file" name="file" on:change={onFileSelected} bind:this={input} />
	</div>

	<button type="submit">Upload to Amazon S3</button>
</form>

<style>
	.avatar {
		max-width: 100px;
	}
</style>
