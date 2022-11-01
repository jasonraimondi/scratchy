process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.TZ = "UTC";

console.log("NODE_ENV:", process.env.NODE_ENV);

import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv-flow/config";
