import { MiddlewareConsumer, Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import type { Request, Response } from "express";

import { AppController } from "~/app/app.controller";
import { AccountModule } from "~/app/account/account.module";
import { OAuthModule } from "~/app/oauth/oauth.module";
import { UserModule } from "~/app/user/user.module";
import { ENV } from "~/config/configuration";
import { MyContext } from "~/lib/graphql/my_context";
import { User } from "~/app/user/entities/user.entity";
import { AuthMiddleware } from "~/lib/middlewares/auth.middleware";
import { registerTypes } from "~/lib/database/register_types";
import { LoggerModule } from "~/lib/logger/logger.module";
import { GraphqlLogger } from "~/lib/graphql/graphql_logger.service";
import { CustomNamingStrategy } from "~/lib/database/naming";
import { QueueWorkerModule } from "~/lib/queue-workers/queue_worker.module";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";
import { JwtModule } from "~/lib/jwt/jwt.module";
import { RoomModule } from "~/app/room/room.module";
import { HealthcheckController } from "~/app/info/controllers/healthcheck.controller";

@Module({
  imports: [
    ...(ENV.isProduction ? [] : [QueueWorkerModule]),
    RoomModule,
    OAuthModule,
    AccountModule,
    UserModule,
    LoggerModule,
    JwtModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: ENV.databaseURL,
      entities: [join(__dirname, "../**/*.entity.ts")],
      logging: false,
      synchronize: true,
      namingStrategy: new CustomNamingStrategy(),
      maxQueryExecutionTime: 250, // To log request runtime
    }),
    GraphQLModule.forRoot({
      logger: new GraphqlLogger(),
      debug: ENV.enableDebugging,
      playground: ENV.enablePlayground,
      autoSchemaFile: ENV.isProduction ? false : "schema.graphql",
      context: ({ res, req }: { res: Response; req: Request }): Partial<MyContext | any> => ({
        ipAddr: req.ip,
        res,
        req,
      }),
    }),
  ],
  controllers: [AppController, HealthcheckController],
  providers: [UserRepo],
})
export class AppModule {
  constructor() {
    registerTypes();
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes("*");
  }
}
