import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { S3Client } from "@aws-sdk/client-s3";

import { JwtAuthGuard } from "~/app/auth/guards/jwt_auth.guard";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

@Controller("/presigned_url")
export class FileController {

  @UseGuards(JwtAuthGuard)
  @Post("/")
  async presignedUrl(@Body() body: any) {

    const client = new S3Client({
      credentials: {
        accessKeyId: "miniominiominio",
        secretAccessKey: "miniominiominio"
      },
      region: "us-east-1",
      endpoint: "http://localhost:9000"
    });

    return createPresignedPost(client, {
      Bucket: "scratchy-bucket",
      Key: body.key ?? "users/1/avatar2.jpg",
      Conditions: [{ acl: "public-read" }, { bucket: "scratchy-bucket" }, ["starts-with", "$key", "users/1/"]],
      Fields: {
        acl: "public-read"
      }
    });
  }
}