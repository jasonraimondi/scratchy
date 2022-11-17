import { sveltekit } from "@sveltejs/kit/vite";
import { resolve } from "path";
import type { UserConfig } from "vite";

const config: UserConfig = {
  plugins: [sveltekit()],
  clearScreen: false,
  server: {
    port: 3000,
    proxy: {
      "/api": "http://127.0.0.1:4000",
    },
  },
  resolve: {
    alias: {
      $styles: resolve("./src/styles"),
      $ui: resolve("./src/components"),
      $api: resolve("./src/generated"),
    },
  },
};

export default config;
