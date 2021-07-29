import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

import { AppController } from "~/app/app.controller";
import { AuthModule } from "~/app/auth/auth.module";
import { UserModule } from "~/app/user/user.module";
import { ENV } from "~/config/environments";
import { graphqlConfig } from "~/config/graphql";
import { QueueWorkerModule } from "~/lib/queue/queue_worker.module";
import { LoggerModule } from "~/lib/logger/logger.module";
import { JwtModule } from "~/lib/jwt/jwt.module";
import { OAuthModule } from "~/app/oauth/oauth.module";
import { QueueModule } from "~/lib/queue/queue.module";

const imports = [];

if (!ENV.isProduction) imports.push(QueueWorkerModule);

@Module({
  imports: [
    ...imports,
    QueueModule,
    JwtModule,
    LoggerModule,
    GraphQLModule.forRoot(graphqlConfig),

    AuthModule,
    UserModule,
    OAuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
