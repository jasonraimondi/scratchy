import { Module } from "@nestjs/common";

import { AuthModule } from "~/app/auth/auth.module";
import { PresignedUrlResolver } from "~/app/file/presigned_url/presigned_url.resolver";
import { DatabaseModule } from "~/lib/database/database.module";
import { LoggerModule } from "~/lib/logger/logger.module";
import { PresignedUrlService } from "~/app/file/presigned_url/presigned_url.service";
import { FileUploadRepository } from "~/lib/database/repositories/file_upload.repository";

@Module({
  imports: [DatabaseModule, AuthModule, LoggerModule],
  providers: [FileUploadRepository, PresignedUrlService, PresignedUrlResolver],
})
export class PresignedUrlModule {}
