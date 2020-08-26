import { Module } from "@nestjs/common";
import { TypeGraphQLModule } from "typegraphql-nestjs";

import { AuthModule } from "~/app/auth/auth.module";
import { UserModule } from "~/app/user/user.module";
import { AppResolver } from "~/app/info/info.resolver";
import { SignupModule } from "~/app/signup/signup.module";
import { ENV } from "~/lib/config/environment";

@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      debug: ENV.enableDebugging,
      playground: true,
      emitSchemaFile: ENV.enableOutputSchema,
      validate: true,
      dateScalarMode: "timestamp",
      context: ({ req }) => ({ currentUser: req.user }),
    }),
    AuthModule,
    SignupModule,
    UserModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
