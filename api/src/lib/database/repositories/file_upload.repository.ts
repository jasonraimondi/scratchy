import { Injectable } from "@nestjs/common";

import { PrismaService } from "~/lib/database/prisma.service";
import { FileUpload } from "~/entities/file_upload.entity";
import { FileUploadCreateInput } from "~/generated/entities";

@Injectable()
export class FileUploadRepository {
  constructor(private prisma: PrismaService) {}

  private get repo() {
    return this.prisma.fileUpload;
  }

  async findById(id: string): Promise<FileUpload> {
    return new FileUpload(await this.repo.findFirstOrThrow({ where: { id } }));
  }

  async listForUser(userId: string) {
    const fileUploads = await this.repo.findMany({
      where: { userId },
    });
    return fileUploads?.map(f => new FileUpload(f)) ?? [];
  }

  async create(fileUpload: FileUploadCreateInput): Promise<void> {
    await this.repo.create({ data: fileUpload });
  }
}
