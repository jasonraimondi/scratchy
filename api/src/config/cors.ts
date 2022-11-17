import type { FastifyCorsOptions } from "@fastify/cors";

export const CORS: FastifyCorsOptions = {
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  origin: [/\.?allmyfutures\.com$/],
};
