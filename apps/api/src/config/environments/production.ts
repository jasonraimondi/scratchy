import { Environment, NodeEnv } from "~/config/environments/base";

export class ProdEnvironment extends Environment {
  nodeEnv: NodeEnv = "production";

  s3 = {
    accessKeyId: process.env.S3_FILE_UPLOADS_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_FILE_UPLOADS_SECRET_KEY as string,
    bucket: process.env.S3_FILE_UPLOADS_BUCKET as string,
    // endpoint: "http://localhost:9000",
    region: "us-east-1",
  };
}
