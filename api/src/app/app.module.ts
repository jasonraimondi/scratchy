import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GraphQLError, GraphQLFormattedError } from "graphql";

import { AppController } from "~/app/app.controller";
import { AccountModule } from "~/app/account/account.module";
import { UserModule } from "~/app/user/user.module";
import { ENV } from "~/config/configuration";
import { MyContext } from "~/lib/graphql/my_context";
import { User } from "~/app/user/entities/user.entity";
import { registerTypes } from "~/app/database/register_types";
import { LoggerModule } from "~/lib/logger/logger.module";
import { GraphqlLogger } from "~/lib/graphql/graphql_logger.service";
import { CustomNamingStrategy } from "~/app/database/naming";
import { QueueWorkerModule } from "~/app/queue-workers/queue_worker.module";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";
import { JwtModule } from "~/lib/jwt/jwt.module";
import { HealthcheckController } from "~/app/system/controllers/healthcheck.controller";
import { Role } from "~/app/user/entities/role.entity";
import { corsSettings } from "~/lib/middlewares/attach_middlewares";
import { AuthModule } from "~/app/auth/auth.module";

@Module({
  imports: [
    ...(ENV.isProduction ? [] : [QueueWorkerModule]),
    AccountModule,
    UserModule,
    LoggerModule,
    JwtModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([User, Role]),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: ENV.databaseURL,
      entities: [ENV.typeorm.entities],
      logging: ENV.enableDebugging,
      synchronize: ENV.typeorm.synchronize,
      namingStrategy: new CustomNamingStrategy(),
      maxQueryExecutionTime: 250, // To log request runtime
    }),
    GraphQLModule.forRoot({
      logger: new GraphqlLogger(),
      debug: ENV.enableDebugging,
      playground: ENV.enablePlayground,
      autoSchemaFile: "schema.graphql",
      cors: corsSettings,
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message: error.extensions?.exception?.response?.message || error.message,
        };
        return graphQLFormattedError;
      },
      context: ({ request, reply }): Partial<MyContext> => {
        return {
          ipAddr: request.ip,
          user: request.user,
          req: request,
          res: reply,
        }
      },
    }),
    AuthModule,
  ],
  controllers: [AppController, HealthcheckController],
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
