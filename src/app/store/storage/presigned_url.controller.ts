import { Controller, Get, Query } from "@nestjs/common";

import { WasabiService } from "~/app/store/storage/wasabi.service";

import { IsMimeType, IsString } from "class-validator";

export class PresignedUrlQuery {
  @IsMimeType()
  contentType: string;

  @IsString()
  objectName: string;

  @IsString()
  path: string;
}

@Controller("presigned_url")
export class PresignedUrlController {
  constructor(private readonly wasabiService: WasabiService) {}

  @Get()
  index(@Query() query: PresignedUrlQuery): Promise<string> {
    return this.wasabiService.getPresignedUrl(query);
  }
}
