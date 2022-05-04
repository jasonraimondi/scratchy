import { Injectable } from "@nestjs/common";

import { PrismaService } from "~/lib/database/prisma.service";
import { FileUpload } from "~/entities/file_upload.entity";
import { FileUploadCreateInput } from "@modules/prisma/generated/models";

@Injectable()
export class FileUploadRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<FileUpload> {
    return new FileUpload(
      await this.prisma.fileUpload.findUnique({
        rejectOnNotFound: true,
        where: { id },
      }),
    );
  }

  async listForUser(userId: string) {
    const fileUploads =
      (await this.prisma.fileUpload.findMany({
        where: { userId },
      })) ?? [];
    return fileUploads.map(f => new FileUpload(f));
  }

  async create(fileUpload: FileUploadCreateInput): Promise<void> {
    await this.prisma.fileUpload.create({ data: fileUpload });
  }
}
