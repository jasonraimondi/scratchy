import preprocess from 'svelte-preprocess';
import { resolve } from 'path';
import node from '@sveltejs/adapter-node';

/** @type {import('vite').UserConfig} */
const vite = {
	resolve: {
		alias: {
			$api: resolve('./src/generated'),
			$styles: resolve('./src/styles')
		}
	}
}

/** @type {import("@sveltejs/kit").Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: {
			adapt: node({ out: 'dist' })
		},
		vite
	}
};

export default config;
