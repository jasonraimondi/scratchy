import { Module } from "@nestjs/common";

import { DatabaseModule } from "~/database/database.module";
import { AuthController } from "~/modules/auth/auth.controller";
import { AuthService } from "~/modules/auth/auth.service";

@Module({
  controllers: [AuthController],
  imports: [DatabaseModule],
  providers: [AuthService],
})
export class AuthModule {}
