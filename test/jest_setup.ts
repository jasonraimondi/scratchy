import "dotenv/config";
import "reflect-metadata";

import { ENV } from "~/lib/config/environment";
import { join } from "path";

ENV.emailTemplatesDir = join(__dirname, "templates/emails");
