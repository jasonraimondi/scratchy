import preprocess from "svelte-preprocess";
import { resolve } from "path";
import node from '@sveltejs/adapter-node';

/** @type {import("@sveltejs/kit").Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [preprocess({
    "postcss": true
  })],

  kit: {
    adapter: node({ out: 'dist' }),
    target: "#_app",
    vite: {
      resolve: {
        alias: {
          $api: resolve('./generated'),
          $styles: resolve('./src/styles'),
        }
      }
    }
  }
};

export default config;
