import { Module } from "@nestjs/common";
import { TypeGraphQLModule } from "typegraphql-nestjs";

import { AuthModule } from "~/app/auth/auth.module";
import { AppResolver } from "~/app/info/info.resolver";
import { SignupModule } from "~/app/signup/signup.module";
import { UserModule } from "~/app/user/user.module";
import { ENV } from "~/lib/config/environment";

@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      debug: ENV.enableDebugging,
      playground: !ENV.isProduction,
      emitSchemaFile: ENV.enableOutputSchema ? "schema.graphql" : false,
      validate: true,
      dateScalarMode: "timestamp",
      context: ({ res, req }) => ({ currentUser: req.user, res, req }),
    }),
    AuthModule,
    SignupModule,
    UserModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
