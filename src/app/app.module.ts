import { MiddlewareConsumer, Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import type { Request, Response } from "express";
import { AppController } from "~/app/app.controller";

import { AuthModule } from "~/app/auth/auth.module";
import { OAuthModule } from "~/app/oauth/oauth.module";
import { MyJwtService } from "~/app/oauth/services/jwt.service";
import { SignupModule } from "~/app/signup/signup.module";
import { UserModule } from "~/app/user/user.module";
import { ENV } from "~/config/environment";
import { MyContext } from "~/config/my_context";
import { User } from "~/entity/user/user.entity";
import { AuthMiddleware } from "~/lib/guards/auth.middleware";
import { registerTypes } from "~/lib/helpers/register_types";
import { LoggerModule } from "~/lib/logger/logger.module";
import { GraphqlLogger } from "~/lib/graphql/graphql_logger.service";
import { CustomNamingStrategy } from "~/lib/naming";
import { QueueWorkerModule } from "~/lib/queue-workers/queue_worker.module";
import { UserRepo } from "~/lib/repositories/user/user.repository";
import { HealthcheckController } from "./healthcheck/healthcheck.controller";

const imports = [];

if (ENV.isDevelopment) imports.push(QueueWorkerModule);

@Module({
  imports: [
    JwtModule.register({
      secret: ENV.jwtSecret,
    }),
    OAuthModule,
    AuthModule,
    SignupModule,
    UserModule,
    LoggerModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: ENV.databaseURL,
      entities: [join(__dirname, "../**/*.entity.ts")],
      logging: true,
      synchronize: true,
      namingStrategy: new CustomNamingStrategy(),
      // maxQueryExecutionTime: 0.2, // To log request runtime
    }),
    GraphQLModule.forRoot({
      logger: new GraphqlLogger(GraphQLModule.name),
      debug: ENV.enableDebugging,
      playground: ENV.enablePlayground,
      autoSchemaFile: ENV.isDevelopment ? "schema.graphql" : false,
      context: ({ res, req }: { res: Response; req: Request }): Partial<MyContext | any> => ({
        ipAddr: req.headers?.["x-forwarded-for"] || req.connection.remoteAddress,
        res,
        req,
      }),
    }),
    ...imports,
  ],
  controllers: [AppController, HealthcheckController],
  providers: [UserRepo, MyJwtService],
})
export class AppModule {
  constructor() {
    registerTypes();
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes("*");
  }
}
