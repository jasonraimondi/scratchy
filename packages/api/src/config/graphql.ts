import { MercuriusDriver, MercuriusDriverConfig } from "@nestjs/mercurius";
// import { GraphQLError, GraphQLFormattedError } from "graphql";

// import { ENV } from "~/config/environment";
// import { GraphqlLogger } from "~/lib/logger/graphql.logger";
import { MyContext } from "~/config/context";
import { ENV } from "~/config/environment";
// import { CORS } from "~/config/cors";

export const graphqlConfig: MercuriusDriverConfig = {
  // logger: new GraphqlLogger(),
  driver: MercuriusDriver,
  // debug: ENV.isDebug,
  graphiql: ENV.isDevelopment,
  ide: ENV.isDevelopment,
  autoSchemaFile: "schema.graphql",
  // cors: CORS,
  buildSchemaOptions: {
    numberScalarMode: "integer",
  },
  // formatError: (error: GraphQLError): GraphQLFormattedError => ({
  //   message: error.message,
  // }),
  context: ({ request, reply }: any): Partial<MyContext> => ({
    ipAddr: request?.ip ?? "127.0.0.3",
    user: request?.user,
    req: request,
    res: reply,
  }),
};
