import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

import { AuthModule } from "~/app/auth/auth.module";
import { SignupModule } from "~/app/signup/signup.module";
import { UserModule } from "~/app/user/user.module";
import { ENV } from "~/config/environment";
import { MyContext } from "~/config/my_context";
import { registerTypes } from "~/lib/helpers/register_types";
import { LoggerModule } from "~/lib/logger/logger.module";
import { GraphqlLogger } from "~/lib/graphql/graphql_logger.service";
import { QueueWorkerModule } from "~/lib/queue-workers/queue_worker.module";
import { HealthcheckController } from "./healthcheck/healthcheck.controller";

const imports = [];

if (ENV.isDevelopment) imports.push(QueueWorkerModule);

@Module({
  imports: [
    AuthModule,
    SignupModule,
    UserModule,
    LoggerModule,
    GraphQLModule.forRoot({
      logger: new GraphqlLogger(GraphQLModule.name),
      debug: ENV.enableDebugging,
      playground: ENV.enablePlayground,
      autoSchemaFile: ENV.isDevelopment ? "schema.graphql" : false,
      context: ({ res, req }): Partial<MyContext | any> => ({
        ipAddr: req.headers?.["x-forwarded-for"] || req.connection.remoteAddress,
        res,
        req,
      }),
    }),
    ...imports,
  ],
  controllers: [HealthcheckController],
})
export class AppModule {
  constructor() {
    registerTypes();
  }
}
