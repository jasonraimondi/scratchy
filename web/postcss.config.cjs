const { resolve } = require("path");
const { generateMediaQueries } = require("@jmondi/mobile-first");

module.exports = {
  plugins: {
    "postcss-import": {
      path: [resolve(__dirname, "src")],
    },
    "postcss-mixins": {},
    "postcss-nested": {},
    "postcss-custom-media": {
      importFrom: [
        {
          customMedia: {
            "--light": "(prefers-color-scheme: light)",
            "--dark": "(prefers-color-scheme: dark)",
            ...generateMediaQueries({
              xxlarge: 1536,
              xlarge: 1280,
              large: 1024,
              medium: 768,
              small: 640,
              xsmall: 420,
            }),
          },
        },
      ],
    },
    autoprefixer: {},
  },
};
