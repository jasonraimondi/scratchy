import { Module } from "@nestjs/common";
import { FileController } from "~/app/file/file.controller";
import { FileUploadRepository } from "~/app/file/file_upload.repository";
import { DatabaseModule } from "~/lib/database/database.module";
import { LoggerModule } from "~/lib/logger/logger.module";
import { AuthModule } from "~/app/auth/auth.module";

@Module({
  imports: [DatabaseModule, AuthModule, LoggerModule],
  controllers: [FileController],
  providers: [FileUploadRepository],
})
export class FileModule {}
