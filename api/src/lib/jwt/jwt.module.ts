import { Module } from "@nestjs/common";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";

import { ENV } from "~/config/configuration";
import { MyJwtService } from "~/lib/jwt/jwt.service";

@Module({
  imports: [
    NestJwtModule.register({
      secret: ENV.secret,
    }),
  ],
  providers: [MyJwtService],
  exports: [MyJwtService],
})
export class JwtModule {}
