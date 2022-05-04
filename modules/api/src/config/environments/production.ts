import { Environment, NodeEnv } from "~/config/environments/base";

export class ProdEnvironment extends Environment {
  nodeEnv: NodeEnv = "production";
}
