<script>
	const links = [
		{
			name: 'GitHub',
			href: 'https://scratchy.localdomain/api/oauth2/github'
		},
		{
			name: 'Google',
			href: 'https://scratchy.localdomain/api/oauth2/google'
		},
		{
			name: 'Facebook',
			href: 'https://scratchy.localdomain/api/oauth2/facebook'
		}
	];
</script>

<ul>
	{#each links as link}
		<li><a rel="external" class={link.name.toLowerCase()} href={link.href}>{link.name}</a></li>
	{/each}
</ul>

<hr />

<style lang="postcss">
	hr {
		background-color: orange;
	}

	ul,
	li {
		width: 100%;
	}

	a {
		display: block;
		text-align: center;
		padding: 0.35em 0;
		margin: 0.2em 0;
	}

	a.github {
		background-color: var(--colors-black);
		color: var(--colors-white);

		&:hover {
			background-color: var(--colors-gray-900);
			color: var(--colors-white);
		}
	}

	a.google {
		background-color: var(--colors-red-600);
		color: var(--colors-white);

		&:hover {
			background-color: var(--colors-red-800);
			color: var(--colors-white);
		}
	}

	a.facebook {
		background-color: var(--colors-blue-600);
		color: var(--colors-white);

		&:hover {
			background-color: var(--colors-blue-800);
			color: var(--colors-white);
		}
	}
</style>
