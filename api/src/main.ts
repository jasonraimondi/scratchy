import "./initializer";

import { Env } from "~/config/env";
import { createServer } from "~/server";
import { logger } from "~/lib/utils/logger";

const server = createServer();

(async () => {
  logger.info(Env.PORT);
  logger.info("Booting Server");
  await server.start();
})().catch(error => {
  logger.error(error);
  process.exit(1);
});
