import { Module } from "@nestjs/common";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailerModule } from "@nestjs-modules/mailer";
import { TypeGraphQLModule } from "typegraphql-nestjs";

import { AppController } from "~/app.controller";
import { AuthModule } from "~/modules/auth/auth.module";
import { UserModule } from "~/modules/user/user.module";
import { AppResolver } from "~/modules/app/app_resolver";
import { SignupModule } from "~/modules/signup/signup.module";

@Module({
  controllers: [AppController],
  imports: [
    TypeGraphQLModule.forRoot({
      debug: true,
      playground: true,
      emitSchemaFile: true,
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
