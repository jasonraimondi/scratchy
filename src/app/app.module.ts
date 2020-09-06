import { Module } from "@nestjs/common";
import { TypeGraphQLModule } from "typegraphql-nestjs";

import { AuthModule } from "~/app/auth/auth.module";
import { AppResolver } from "~/app/info/info.resolver";
import { SignupModule } from "~/app/signup/signup.module";
import { UserModule } from "~/app/user/user.module";
import { ENV } from "~/lib/config/environment";
import { MyContext } from "~/lib/config/my_context";
import { WorkerModule } from "~/lib/queue/worker.module";

const imports = [
  TypeGraphQLModule.forRoot({
    debug: ENV.enableDebugging,
    playground: !ENV.isProduction,
    emitSchemaFile: ENV.enableOutputSchema ? "schema.graphql" : false,
    validate: true,
    dateScalarMode: "timestamp",
    context: ({ res, req }): Partial<MyContext> => ({
      currentUser: req.user,
      ipAddr: req.headers?.["x-forwarded-for"] || req.connection.remoteAddress,
      res,
      req,
    }),
  }),
  AuthModule,
  SignupModule,
  UserModule,
];

if (ENV.isDevelopment) imports.push(WorkerModule)

@Module({
  imports,
  providers: [AppResolver],
})
export class AppModule {}
