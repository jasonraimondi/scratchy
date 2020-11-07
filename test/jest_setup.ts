import "dotenv/config";
import "reflect-metadata";

import nunjucks from "nunjucks";

import { ENV } from "../src/config/configuration";

nunjucks.configure(ENV.templatesDir, {
  autoescape: true,
});
