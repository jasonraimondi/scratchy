import { Logger, Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

import { AuthModule } from "~/app/auth/auth.module";
import { AppResolver } from "~/app/info/info.resolver";
import { SignupModule } from "~/app/signup/signup.module";
import { UserModule } from "~/app/user/user.module";
import { ENV } from "~/config/environment";
import { MyContext } from "~/config/my_context";
import { GraphqlLogger } from "~/lib/graphql/graphql.logger";
import { QueueWorkerModule } from "~/lib/queue-workers/queue_worker.module";

const imports = [
  GraphQLModule.forRoot({
    logger: new GraphqlLogger(GraphQLModule.name),
    debug: ENV.enableDebugging,
    playground: ENV.enablePlayground,
    autoSchemaFile: ENV.isDevelopment ? "schema.graphql" : false,
    // validate: true,
    // dateScalarMode: "timestamp",
    context: ({ res, req }): Partial<MyContext | any> => ({
      ipAddr: req.headers?.["x-forwarded-for"] || req.connection.remoteAddress,
      res,
      req,
    }),
  }),
  AuthModule,
  SignupModule,
  UserModule,
];

if (ENV.isDevelopment) imports.push(QueueWorkerModule);

@Module({
  imports,
  providers: [AppResolver],
})
export class AppModule {}
