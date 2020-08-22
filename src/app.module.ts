import { Module } from "@nestjs/common";
import { TypeGraphQLModule } from "typegraphql-nestjs";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailerModule } from "@nestjs-modules/mailer";

import { AppController } from "~/app.controller";
import { AuthModule } from "~/modules/auth/auth.module";
import { UserModule } from "~/modules/user/user.module";
import { AppResolver } from "~/modules/app/app_resolver";
import { ENV } from "~/lib/constants/config";

@Module({
  controllers: [AppController],
  imports: [
    MailerModule.forRoot({
      transport: ENV.mailerURL,
      defaults: {
        from:'"graphql-scratchy" <jason+scratchy@raimondi.us>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    TypeGraphQLModule.forRoot({
      debug: true,
      playground: true,
      emitSchemaFile: true,
      validate: true,
      dateScalarMode: "timestamp",
      context: ({ req }) => ({ currentUser: req.user }),
    }),
    AuthModule,
    UserModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
