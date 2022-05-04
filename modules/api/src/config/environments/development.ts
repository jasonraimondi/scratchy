import { Environment, NodeEnv } from "~/config/environments/base";
import ms from "ms";

export class DevEnvironment extends Environment {
  nodeEnv: NodeEnv = "development";

  ttl = {
    accessToken: ms("10m"),
    refreshToken: ms("25m"),
    refreshTokenRememberMe: ms("1h"),
    forgotPasswordToken: ms("5m"),
    emailConfirmationToken: ms("10m"),
  };
}
