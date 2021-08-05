import { Module } from "@nestjs/common";
import { FileController } from "~/app/file/file.controller";

@Module({
  controllers: [FileController],
})
export class FileModule {}
