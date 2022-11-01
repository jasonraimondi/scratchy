import { Environment } from "~/config/environments/base";
import { DevEnvironment } from "~/config/environments/development";
import { ProdEnvironment } from "~/config/environments/production";

let ENV: Readonly<Environment>;

const NODE_ENV = process.env.NODE_ENV && process.env.NODE_ENV !== "" ? process.env.NODE_ENV : "development";

if (["test", "development"].includes(NODE_ENV)) {
  ENV = new DevEnvironment();
} else {
  ENV = new ProdEnvironment();
}

export { ENV };
