import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { AuthService } from "~/app/auth/services/auth.service";
import { DatabaseModule } from "~/lib/database/database.module";
import { AuthResolver } from "~/app/auth/auth.resolver";
import { JwtModule } from "~/lib/jwt/jwt.module";
import { LoggerModule } from "~/lib/logger/logger.module";

// import { GithubStrategy } from "~/app/auth/strategies/github.strategy";
// import { GoogleStrategy } from "~/app/auth/strategies/google.strategy";
import { JwtStrategy } from "~/app/auth/strategies/jwt.strategy";
import { TokenService } from "~/app/auth/services/token.service";
import { AuthMiddleware } from "~/lib/middleware/auth.middleware";
// import { GithubAuthGuard, GithubController } from "~/app/auth/controllers/github.controller";
// import { GoogleAuthGuard, GoogleController } from "~/app/auth/controllers/google.controller";

// const strategies = [GithubStrategy, GoogleStrategy, JwtStrategy];
// const guards = [GithubAuthGuard, GoogleAuthGuard];

@Module({
  imports: [DatabaseModule, JwtModule, LoggerModule],
  providers: [
    AuthService,
    TokenService,
    AuthResolver,
    JwtStrategy,
    AuthMiddleware,
    // ...strategies,
    // ...guards,
  ],
  // controllers: [GithubController, GoogleController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes("*");
  }
}
