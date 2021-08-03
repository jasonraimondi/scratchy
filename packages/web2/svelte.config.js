import preprocess from "svelte-preprocess";
import { resolve } from "path";

/** @type {import("@sveltejs/kit").Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [preprocess({
    "postcss": true
  })],

  kit: {
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
