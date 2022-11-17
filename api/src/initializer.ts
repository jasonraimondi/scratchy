const env = process.env.NODE_ENV ?? "development";

process.env.NODE_ENV = /(production|development|test)/.test(env) ? env : "development";
process.env.TZ = "UTC";

import "dotenv-flow/config";
import "source-map-support/register";
import "tsconfig-paths/register";
