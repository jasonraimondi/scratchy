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

const imports = [AuthModule, UserModule, JwtModule, LoggerModule, GraphQLModule.forRoot(graphqlConfig)];

if (!ENV.isProduction) imports.push(QueueWorkerModule);

@Module({
  imports: imports,
  controllers: [AppController],
})
export class AppModule {}
