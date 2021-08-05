import { Controller, Post, UseGuards } from "@nestjs/common";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { JwtAuthGuard } from "~/app/auth/guards/jwt_auth.guard";

@Controller("/presigned_url")
export class FileController {

  @UseGuards(JwtAuthGuard)
  @Post("/")
  async presignedUrl() {
    const client = new S3Client({
      region: "us-east-1",
      endpoint: "https://scratchy.localdomain/minio/",
    });
    const command = new PutObjectCommand({
      Bucket: "scratchy_uploads",
      Key: "test/farts.jpg"
    });
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return { url };
  }
}