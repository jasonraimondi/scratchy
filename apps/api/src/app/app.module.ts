import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MercuriusDriverConfig } from "@nestjs/mercurius";
import { GraphQLModule } from "@nestjs/graphql";
import { BullModule } from "@nestjs/bullmq";

import { AppController } from "~/app/app.controller";
import { AuthModule } from "~/app/auth/auth.module";
import { FileModule } from "~/app/file/file.module";
import { UserModule } from "~/app/user/user.module";
import { ENV } from "~/config/environment";
import { graphqlConfig } from "~/config/graphql";
import { QueueWorkerModule } from "~/lib/queue/queue_worker.module";
import { LoggerModule } from "~/lib/logger/logger.module";
import { JwtModule } from "~/lib/jwt/jwt.module";
import { CurrentUserMiddleware } from "~/lib/middleware/current_user.middleware";

// prettier-ignore
const mainImports = [
  BullModule.forRoot({
    connection: ENV.queue,
  }),
  JwtModule,
  LoggerModule,
  GraphQLModule.forRoot<MercuriusDriverConfig>(graphqlConfig)
];

// prettier-ignore
const appImports = [
  AuthModule,
  UserModule,
  FileModule,
];

if (ENV.isDevelopment) mainImports.push(QueueWorkerModule);

@Module({
  imports: [...mainImports, ...appImports],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(CurrentUserMiddleware)
      .exclude("(.*ping)") // excludes /ping endpoint
      .forRoutes("(.*)");
  }
}
