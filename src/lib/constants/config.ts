export const ENV = {
  cookieDomain: process.env.DOMAIN,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? "",
  enableDebugging: !!process.env.ENABLE_DEBUGGING,
  enableOutputSchema: !!process.env.ENABLE_OUTPUT_SCHEMA,
  corsURLS: (process.env.CORS_URLS ?? "").split(","),
  mailerURL: process.env.MAILER_URL ?? "smtp://localhost:1025",
  baseURL: process.env.BASE_URL ?? "http://localhost:8080",
};
