import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

class Cors implements CorsOptions {
  origin = true;
  credentials = true;
}

export const CORS = new Cors();
