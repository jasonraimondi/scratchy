import { Module } from "@nestjs/common";
import { FileController } from "~/app/file/file.controller";
import { FileUploadRepository } from "~/app/file/file_upload.repository";
import { DatabaseModule } from "~/lib/database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [FileController],
  providers: [FileUploadRepository],
})
export class FileModule {}
