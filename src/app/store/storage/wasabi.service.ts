import { Injectable } from "@nestjs/common";
import AWS from "aws-sdk";
import { ENV } from "~/config/configuration";
import { PresignedUrlQuery } from "~/app/store/storage/presigned_url.controller";

@Injectable()
export class WasabiService {
  s3: AWS.S3;

  constructor() {
    // @todo fix this
    const ep = new AWS.Endpoint(ENV.aws.host);
    if (!ENV.isProduction) ep.protocol = "http";
    this.s3 = new AWS.S3({ endpoint: ep });
    this.s3.config.update({
      accessKeyId: ENV.aws.accessKey,
      secretAccessKey: ENV.aws.secretKey,
      s3ForcePathStyle: true,
    });
  }

  getPresignedUrl({ contentType, objectName, path }: PresignedUrlQuery) {
    return this.s3.getSignedUrlPromise("putObject", {
      Bucket: ENV.aws.bucket,
      Key: objectName,
      ContentType: contentType,
      Expires: 60 * 5, //time to expire in seconds,
    });
  }
}
