import { Environment, NodeEnv } from "~/config/environments/base";
import ms from "ms";

export class ProdEnvironment extends Environment {
  nodeEnv: NodeEnv = "production";

  ttl = {
    accessToken: ms("1h"),
    refreshToken: ms("36h"),
    refreshTokenRememberMe: ms("30d"),
    forgotPasswordToken: ms("30m"),
    emailConfirmationToken: ms("14d"),
  };

  s3 = {
    accessKeyId: process.env.S3_FILE_UPLOADS_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_FILE_UPLOADS_SECRET_KEY as string,
    bucket: process.env.S3_FILE_UPLOADS_BUCKET as string,
    region: "us-east-1",
  };
}
