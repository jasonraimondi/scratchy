import preprocess from "svelte-preprocess";
import { resolve } from "path";
import { mdsvex } from "mdsvex";
import node from "@sveltejs/adapter-node";

/** @type {import('vite').UserConfig} */
const vite = {
  server: {
    proxy: {
      "/api": "http://127.0.0.1:4400",
    },
  },
  resolve: {
    alias: {
      $lib: resolve("./src/lib"),
      $styles: resolve("./src/styles"),
      $ui: resolve("./src/components"),
    },
  },
};

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
    adapter: {
      adapt: node({ out: "dist" }),
    },
    vite,
  },
};

export default config;
