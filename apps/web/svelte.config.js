import preprocess from "svelte-preprocess";
import { mdsvex } from "mdsvex";
import node from "@sveltejs/adapter-node";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".svelte.md"],

  preprocess: [
    mdsvex({
      extensions: [".svelte.md"],
      layout: {
        default: "./src/components/layouts/mdsvex/default.svelte",
      },
    }),
    preprocess({
      postcss: true,
    }),
  ],

  kit: {
    adapter: node({ out: "dist" }),
  },
};

export default config;
