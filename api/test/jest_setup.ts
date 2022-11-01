process.env.NODE_ENV = "test";
process.env.TZ = "UTC";

import "reflect-metadata";
import "dotenv-flow/config";

import * as nunjucks from "nunjucks";

import { ENV } from "~/config/environment";

nunjucks.configure(ENV.templatesDir, {
  autoescape: true,
});
