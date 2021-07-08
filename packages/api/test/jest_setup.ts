import "reflect-metadata";

import * as nunjucks from "nunjucks";

import { ENV } from "../src/config/environments";

nunjucks.configure(ENV.templatesDir, {
  autoescape: true,
});

ENV.urls.web = new URL("http://localhost");
