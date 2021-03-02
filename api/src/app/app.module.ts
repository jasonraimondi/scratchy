import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "~/app/app.controller";
import { AccountModule } from "~/app/account/account.module";
import { UserModule } from "~/app/user/user.module";
import { ENV } from "~/config/environments";
import { User } from "~/app/user/entities/user.entity";
import { registerTypes } from "~/app/database/register_types";
import { LoggerModule } from "~/lib/logger/logger.module";
import { QueueWorkerModule } from "~/app/queue-workers/queue_worker.module";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";
import { JwtModule } from "~/lib/jwt/jwt.module";
import { Role } from "~/app/user/entities/role.entity";
import { AuthModule } from "~/app/auth/auth.module";
import { SystemModule } from "~/app/system/system.module";
import { databaseConfig } from "~/config/database";
import { graphqlConfig } from "~/config/graphql";

@Module({
  imports: [
    ...(ENV.isProduction ? [] : [QueueWorkerModule]),
    AccountModule,
    AuthModule,
    SystemModule,
    UserModule,

    JwtModule,
    LoggerModule,

    GraphQLModule.forRoot(graphqlConfig),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([User, Role]),
    TypeOrmModule.forRoot(databaseConfig),
  ],
  controllers: [AppController],
  providers: [UserRepo],
})
export class AppModule {
  constructor() {
    registerTypes();
  }

  // configure(consumer: MiddlewareConsumer): void {
  //   consumer.apply(AuthMiddleware).forRoutes("*");
  // }
}
