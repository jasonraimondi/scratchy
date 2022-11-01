import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

class Cors implements CorsOptions {
  allowedHeaders = ["Authorization", "Content-Type"];
  credentials = true;
  methods = ["GET", "POST", "OPTIONS"];
  origin = [/\.?allmyfutures\.com$/];
}

export const CORS = new Cors();

console.log(CORS);
