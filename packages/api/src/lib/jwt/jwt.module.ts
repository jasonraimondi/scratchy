import { Module } from "@nestjs/common";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";

import { ENV } from "~/config/environments";
import { MyJwtService } from "~/lib/jwt/jwt.service";

@Module({
  imports: [
    NestJwtModule.register({
      secret: ENV.jwtSecret,
    }),
  ],
  providers: [MyJwtService],
  exports: [MyJwtService],
})
export class JwtModule {}
