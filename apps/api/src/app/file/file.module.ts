import { Module } from "@nestjs/common";

import { AuthModule } from "~/app/auth/auth.module";
import { FileUploadRepository } from "~/lib/database/repositories/file_upload.repository";
import { FileUploadResolver } from "~/app/file/file_upload.resolver";
import { PresignedUrlModule } from "~/app/file/presigned_url/presigned_url.module";
import { DatabaseModule } from "~/lib/database/database.module";
import { LoggerModule } from "~/lib/logger/logger.module";

@Module({
  imports: [DatabaseModule, AuthModule, LoggerModule, PresignedUrlModule],
  providers: [FileUploadRepository, FileUploadResolver],
})
export class FileModule {}
