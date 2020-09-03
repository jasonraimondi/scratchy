import "dotenv/config";
import "reflect-metadata";

import { join } from "path";

import { ENV } from "~/lib/config/environment";

ENV.emailTemplatesDir = join(__dirname, "templates/emails");
ENV.baseURL = "localhost";
