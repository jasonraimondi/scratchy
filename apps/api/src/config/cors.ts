import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { ENV } from "./environment";

class Cors implements CorsOptions {
  credentials = true;
  methods = ["GET", "POST"];
  origin = ["*", ENV.urlApi, ENV.urlWeb];
}

export const CORS = new Cors();
