import * as path from "path";
import { CustomNamingStrategy } from "./src/lib/naming";

module.exports = {
  name: "default",
  type: "postgres",
  host: "localhost",
  port: 30532,
  username: "scratchy",
  password: "secret",
  database: "scratchy",
  entities: [
    path.join(__dirname, 'src/**', '*.entity.{ts,js}')
  ],
  namingStrategy: new CustomNamingStrategy(),
  migrationsTableName: "migrations",
  migrations: ["db/migrations/*.ts"],
  cli: {
    migrationsDir: "db/migrations"
  }
};
