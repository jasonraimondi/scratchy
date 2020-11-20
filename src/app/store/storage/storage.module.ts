import { Module } from "@nestjs/common";

import { WasabiService } from "~/app/store/storage/wasabi.service";
import { PresignedUrlController } from "~/app/store/storage/presigned_url.controller";

@Module({
  controllers: [PresignedUrlController],
  exports: [WasabiService],
  providers: [WasabiService],
})
export class StorageModule {}
