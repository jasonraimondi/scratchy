import { INestApplication } from "@nestjs/common";
import { urlencoded } from "body-parser";
import { router as bullUI } from "bull-board";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import { ENV } from "~/config/configuration";

export const corsSettings = {
  origin: true,
  credentials: true,
};

export const attachMiddlewares = (app: INestApplication) => {
  app.use(urlencoded({ extended: false }));
  app.use(cookieParser());

  app.enableCors(corsSettings);

  if (ENV.isProduction) {
    app.use(helmet());
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
      }),
    );
  }

  if (!ENV.isTesting) {
    app.use("/admin/queues", bullUI);
  }
};
