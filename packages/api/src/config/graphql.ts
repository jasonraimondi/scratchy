import { GqlModuleOptions } from "@nestjs/graphql/dist/interfaces/gql-module-options.interface";
import { GraphQLError, GraphQLFormattedError } from "graphql";

import { ENV } from "~/config/environments";
import { CORS } from "~/config/cors";
import { GraphqlLogger } from "~/lib/logger/graphql.logger";
import { MyContext } from "~/config/context";

export const graphqlConfig: GqlModuleOptions = {
  logger: new GraphqlLogger(),
  debug: ENV.enableDebugging,
  // playground: ENV.enablePlayground,
  autoSchemaFile: "schema.graphql",
  cors: CORS,
  buildSchemaOptions: {
    numberScalarMode: "integer",
  },
  formatError: (error: GraphQLError): GraphQLFormattedError => ({
    message: error.extensions?.exception?.response?.message ?? error.message,
  }),
  context: ({ request, reply }): Partial<MyContext> => ({
    ipAddr: request?.ip ?? "127.0.0.3",
    user: request?.user,
    req: request,
    res: reply,
  }),
};
