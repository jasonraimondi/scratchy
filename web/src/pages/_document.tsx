import React from "react";
import Document, { Head, Html, Main, NextScript } from "next/document";
import { Global } from "@emotion/core";
import { baseStyles } from "@/styles/base";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <Global styles={baseStyles} />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
