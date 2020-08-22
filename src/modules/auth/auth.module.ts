import { Module } from "@nestjs/common";

import { DatabaseModule } from "~/database/database.module";
import { AuthController } from "~/modules/auth/auth.controller";
import { AuthService } from "~/modules/auth/auth.service";
import { AuthResolver } from "~/modules/auth/resolvers/auth_resolver";

@Module({
  controllers: [AuthController],
  imports: [DatabaseModule],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
