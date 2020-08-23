import { Module } from "@nestjs/common";
import { TypeGraphQLModule } from "typegraphql-nestjs";

import { AuthModule } from "~/modules/auth/auth.module";
import { UserModule } from "~/modules/user/user.module";
import { AppResolver } from "~/modules/app/app_resolver";
import { SignupModule } from "~/modules/signup/signup.module";
import { ENV } from "~/config/environment";

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
