import { EnvSchema } from "~/config/environments/base";

export default {
  accessKeyId: process.env.S3_FILE_UPLOADS_ACCESS_KEY as string,
  secretAccessKey: process.env.S3_FILE_UPLOADS_SECRET_KEY as string,
  bucket: process.env.S3_FILE_UPLOADS_BUCKET as string,
  endpoint: "http://localhost:9000",
  region: "us-east-1",
} as EnvSchema["s3"];
