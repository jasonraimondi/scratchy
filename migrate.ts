import { setupSlonikMigrator } from "@slonik/migrator";

import { pool as slonik } from "./src/database";

const migrator = setupSlonikMigrator({
  migrationsPath: __dirname + "/db/migrations",
  slonik,
  mainModule: module,
});

module.exports = { slonik, migrator };
