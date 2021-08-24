<script lang="ts">
	import { goto } from '$app/navigation';
	import { graphQLSdk } from '$lib/api/api_sdk';
	import { forgotPasswordSchema } from '$lib/utils/forms';
	import { validateForm } from '@jmondi/form-validator';
	import { notify } from '$lib/notifications/notification.service';

	let errors: Record<string, string> = {};
	const formData = {
		email: ''
	};

	async function submit() {
		errors = await validateForm({ schema: forgotPasswordSchema, data: formData });
		if (!errors) {
			await graphQLSdk.SendForgotPasswordEmail({ email: formData.email });
			notify.success('It sent!');
			await goto('/');
		}
	}
</script>

<div class="centered-form">
	<form on:submit|preventDefault={submit} data-test="forgot-password-form">
		<div class="form-control">
			<label for="email">Email</label>
			{#if errors?.email}<span class="error">{errors.email}</span>{/if}
			<input
				id="email"
				name="email"
				type="email"
				placeholder="johnny.appleseed@example.com"
				required="required"
				aria-label="email"
				aria-required="true"
				bind:value={formData.email}
			/>
		</div>

		<div class="form-submit">
			<button type="submit">Submit</button>
			<a class="back" href="/login">Back to Login</a>
		</div>
	</form>
</div>
