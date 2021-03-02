import { TypeOrmModuleOptions } from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";

import { CustomNamingStrategy } from "~/app/database/naming";
import { ENV } from "~/config/environments";

export const databaseConfig: TypeOrmModuleOptions = {
  type: "postgres",
  url: ENV.databaseURL,
  entities: [ENV.typeorm.entities],
  logging: ENV.enableDebugging,
  synchronize: ENV.typeorm.synchronize,
  namingStrategy: new CustomNamingStrategy(),
  maxQueryExecutionTime: 250, // To log request runtime
};
