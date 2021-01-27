import { colors } from "@/styles/theme";
import { css } from "@emotion/core";

export const baseStyles = css`
  html {
    font-size: 18px;
    height: 100%;
  }

  body {
    background-color: ${colors.white};
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    font-weight: 400;
    line-height: 1.45;
    color: #333;
    font-size: 1rem;
    height: 100%;
  }

  #__next {
    height: 100%;
  }

  pre,
  code,
  .code {
    font-family: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }

  p {
    margin-bottom: 1.25em;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    margin: 2.75rem 0 1rem;
    font-family: Georgia, Cambria, "Times New Roman", Times, serif;
    font-weight: 400;
    line-height: 1.15;
  }

  h1,
  .h1 {
    margin-top: 0;
    font-size: 3.052em;
  }

  h2,
  .h2 {
    font-size: 2.441em;
  }

  h3,
  .h3 {
    font-size: 1.953em;
  }

  h4,
  .h4 {
    font-size: 1.563em;
  }

  h5,
  .h5 {
    font-size: 1.25em;
  }

  small,
  .small {
    font-size: 0.8em;
  }
`;
