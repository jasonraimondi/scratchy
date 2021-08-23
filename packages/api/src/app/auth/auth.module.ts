import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";

import { AuthService } from "~/app/auth/services/auth.service";
import { AuthResolver } from "~/app/auth/resolvers/auth.resolver";
import { JwtStrategy } from "~/app/auth/_passport/strategies/jwt.strategy";
import { TokenService } from "~/app/auth/services/token.service";
import { GithubController } from "~/app/auth/controllers/github.controller";
import { GoogleController } from "~/app/auth/controllers/google.controller";
import { AuthMiddleware } from "~/lib/middleware/auth.middleware";
import { DatabaseModule } from "~/lib/database/database.module";
import { JwtModule } from "~/lib/jwt/jwt.module";
import { LoggerModule } from "~/lib/logger/logger.module";

@Module({
  controllers: [
    GithubController,
    GoogleController,
  ],
  imports: [
    DatabaseModule,
    HttpModule,
    JwtModule,
    LoggerModule
  ],
  providers: [
    AuthService,
    TokenService,
    AuthResolver,
    JwtStrategy,
    AuthMiddleware,
  ],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes("*");
  }
}
