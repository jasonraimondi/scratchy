import "dotenv/config";

process.env.DATABASE_URL = "postgres://scratchy:secret@localhost:35432/scratchy";

import "reflect-metadata";

import nunjucks from "nunjucks";

import { ENV } from "../src/config/environments";

nunjucks.configure(ENV.templatesDir, {
  autoescape: true,
});

ENV.url = new URL("http://localhost");
