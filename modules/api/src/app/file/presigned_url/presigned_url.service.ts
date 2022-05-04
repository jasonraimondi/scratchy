import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost, PresignedPost } from "@aws-sdk/s3-presigned-post";
import { Injectable } from "@nestjs/common";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";
import { IsIn } from "class-validator";

import { FileUploadRepository } from "~/lib/database/repositories/file_upload.repository";
import { ENV } from "~/config/environment";
import { FileUpload } from "~/entities/file_upload.entity";
import { User } from "~/entities/user.entity";
import { v4 } from "uuid";
import { S3_PATHS } from "~/config/urls";

@ObjectType()
export class PresignedUrl implements PresignedPost {
  @Field(() => String!, { nullable: false })
  url!: string;

  @Field(() => GraphQLJSON, { nullable: false })
  fields!: Record<string, string>;
}

@InputType()
export class PresignedUrlInput {
  @Field(() => String!, { nullable: false })
  fileName!: string;

  @Field(() => String!, { nullable: false })
  @IsIn(["image/png", "image/jpg"])
  mimeType!: string;

  @Field(() => String!, { nullable: false })
  @IsIn(["avatar"])
  type!: string;
}

@Injectable()
export class PresignedUrlService {
  private readonly client = new S3Client({
    credentials: {
      accessKeyId: ENV.s3.accessKeyId,
      secretAccessKey: ENV.s3.secretAccessKey,
    },
    region: ENV.s3.region,
    endpoint: ENV.s3.endpoint,
  });

  constructor(private readonly fileUploadRepository: FileUploadRepository) {}

  async create(user: User, input: PresignedUrlInput): Promise<PresignedUrl> {
    const fileUploadId = v4();
    const fileUpload = new FileUpload({
      id: fileUploadId,
      userId: user.id,
      originalName: input.fileName,
      path: S3_PATHS.image.create({ userId: user.id, fileUploadId }),
    });
    await this.fileUploadRepository.create(fileUpload);

    const startsWith = `/users/${user.id}/`;

    return createPresignedPost(this.client, {
      Bucket: ENV.s3.bucket,
      Key: fileUpload.path,
      Conditions: [
        { acl: "public-read" },
        { bucket: ENV.s3.bucket },
        // @todo support content type validation
        // { "content-type": "image/png" },
        ["starts-with", "$key", startsWith],
      ],
      Fields: {
        acl: "public-read",
      },
      Expires: 600, // Seconds before the presigned post expires. 3600 by default.
    });
  }
}
