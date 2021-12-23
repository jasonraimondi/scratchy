<script lang="ts">
	import { registerSchema } from '$lib/utils/forms';
	import { validateForm } from '@jmondi/form-validator';
	import { graphQLSdk } from '$lib/api/api_sdk';
	import OAuthLogins from '$lib/auth/OAuthLogins.svelte';
	import { goto } from "$app/navigation";
	import { notify } from "$lib/notifications/notification.service";

	// errors are key value, where key is the form name, and value is the error message
	let errors: Record<string, string> = {};

	const data = {
		email: '',
		password: '',
		firstName: '',
		lastName: ''
	};

	async function submit() {
		errors = await validateForm({ schema: registerSchema, data });
		if (!errors) {
			await graphQLSdk.Register({ input: data });
			const user = await graphQLSdk.User({ email: "jason@raimondi.us" })
			notify.success({
				title: 'Huzzah!!',
				message: 'Go check your inbox for to confirm your email!',
				ttl: 25 * 1000,
			})
			await goto('/');
		}
	}
</script>

<div class="centered-form">
	<form on:submit|preventDefault={submit} data-test="register-form">
		<OAuthLogins />

		<div class="form-columns">
			<div class="form-control">
				<label for="firstName">First</label>
				{#if errors?.firstName}<span class="error">{errors.firstName}</span>{/if}
				<input
					id="firstName"
					name="firstName"
					type="text"
					placeholder="Johnny"
					required="required"
					aria-label="first"
					aria-required="true"
					bind:value={data.firstName}
				/>
			</div>

			<div class="form-control">
				<label for="lastName">Last</label>
				{#if errors?.lastName}<span class="error">{errors.lastName}</span>{/if}
				<input
					id="lastName"
					name="lastName"
					type="text"
					placeholder="Appleseed"
					required="required"
					aria-label="last"
					aria-required="true"
					bind:value={data.lastName}
				/>
			</div>
		</div>

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
				bind:value={data.email}
			/>
		</div>

		<div class="form-control">
			<label for="password">Password</label>
			{#if errors?.password}<span class="error">{errors.password}</span>{/if}
			<input
				id="password"
				name="password"
				type="password"
				placeholder="***************"
				required="required"
				aria-label="password"
				aria-required="true"
				bind:value={data.password}
			/>
		</div>

		<div class="form-submit">
			<button type="submit">Submit</button>
		</div>
	</form>
</div>
