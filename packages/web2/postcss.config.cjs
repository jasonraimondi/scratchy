const xxl = 1536;
const xl = 1280;
const lg = 1024;
const md = 768;
const sm = 640;
const xs = 420;

const { resolve } = require('path');

module.exports = {
  plugins: {
    'postcss-import': {
      path: [resolve(__dirname, 'src')],
    },
    'postcss-mixins': {},
    'postcss-nested': {},
    'postcss-custom-media': {
      importFrom: [{
        customMedia: {
          '--light': '(prefers-color-scheme: light)',
          '--dark': '(prefers-color-scheme: dark)',
          '--xsmall': `(min-width: ${xs}px)`,
          '--xsmall-only': `(max-width: ${(sm - 1)}px)`,
          '--small': `(min-width: ${sm}px)`,
          '--small-only': `(min-width: ${sm}) and (max-width: ${(md - 1)})`,
          '--medium': `(min-width: ${md}px)`,
          '--medium-only': `(min-width: ${md}) and (max-width: ${(lg - 1)})`,
          '--large': `(min-width: ${lg}px)`,
          '--large-only': `(min-width: ${lg}) and (max-width: ${(xl - 1)})`,
          '--xlarge': `(min-width: ${xl}px)`,
          '--xlarge-only': `(min-width: ${xl}) and (max-width: ${(xxl - 1)})`,
          '--xxlarge': `(min-width: ${xxl}px)`,
        },
      }],
    },
    autoprefixer: {},
    cssnano: process.env.NODE_ENV !== "development" ? {
      preset: "default",
    } : false,
  },
};