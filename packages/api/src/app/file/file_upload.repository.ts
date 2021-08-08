import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "~/lib/database/prisma.service";
import { FileUpload } from "~/entities/file_upload.entity";

@Injectable()
export class FileUploadRepository {
  constructor(private prisma: PrismaService) {}

  async create(fileUpload: FileUpload): Promise<void> {
    const { user, ...data } = fileUpload;
    await this.prisma.fileUpload.create({ data });
  }

  async findById(userId: string, extraQuery: { include?: Prisma.FileUploadInclude } = {}): Promise<FileUpload> {
    return new FileUpload(
      await this.prisma.fileUpload.findUnique({
        rejectOnNotFound: true,
        where: { id: userId },
        ...extraQuery,
      }),
    );
  }
}
