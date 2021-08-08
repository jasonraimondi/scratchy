import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { S3Client } from "@aws-sdk/client-s3";

import { JwtAuthGuard } from "~/app/auth/guards/jwt_auth.guard";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { IsIn, IsNotEmpty } from "class-validator";
import { FastifyRequest } from "fastify";
import { FileUpload } from "~/entities/file_upload.entity";
import { FileUploadRepository } from "~/app/file/file_upload.repository";

export class PresignedUrlBody {
  @IsNotEmpty()
  fileName!: string;

  @IsIn(["avatar"])
  type!: "avatar";
}

@Controller("/presigned_url")
export class FileController {

  private readonly client = new S3Client({
    credentials: {
      accessKeyId: "miniominiominio",
      secretAccessKey: "miniominiominio"
    },
    region: "us-east-1",
    endpoint: "http://localhost:9000"
  });

  constructor(private readonly fileUploadRepository: FileUploadRepository) {}

  @UseGuards(JwtAuthGuard)
  @Post("/")
  async presignedUrl(@Body() body: PresignedUrlBody, @Req() req: FastifyRequest) {

    const fileUpload = await FileUpload.create({
      userId: req.user!.id,
      originalName: body.fileName,
    });
    await this.fileUploadRepository.create(fileUpload);



    return createPresignedPost(this.client, {
      Bucket: "scratchy-bucket",
      Key: `users/${req.user!.email}/${body.fileName}`,
      Conditions: [
        { acl: "public-read" },
        { bucket: "scratchy-bucket" },
        ["starts-with", "$key", "users/"]
      ],
      Fields: {
        acl: "public-read"
      }
    });
  }
}