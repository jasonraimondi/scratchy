import { Args, Field, InputType, Query, Resolver } from "@nestjs/graphql";

import { FileUpload } from "~/entities/file_upload.entity";
import { FileUploadRepository } from "~/lib/database/repositories/file_upload.repository";

@InputType()
export class ListFileUploadsInput {
  @Field()
  userId!: string;
}

@Resolver()
export class FileUploadResolver {
  constructor(private repository: FileUploadRepository) {}

  @Query(() => FileUpload!)
  async fileUpload(@Args("id") id: string): Promise<FileUpload> {
    return this.repository.findById(id);
  }

  @Query(() => [FileUpload!]!)
  async fileUploads(@Args("input") input: ListFileUploadsInput): Promise<FileUpload[]> {
    return this.repository.listForUser(input.userId);
  }
}
