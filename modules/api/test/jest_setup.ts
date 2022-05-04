import "reflect-metadata";

import * as nunjucks from "nunjucks";

import { ENV } from "../src/config/environment";

nunjucks.configure(ENV.templatesDir, {
  autoescape: true,
});
