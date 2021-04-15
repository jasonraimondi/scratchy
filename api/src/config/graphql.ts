import { GqlModuleOptions } from "@nestjs/graphql/dist/interfaces/gql-module-options.interface";
import { GraphQLError, GraphQLFormattedError } from "graphql";

import { GraphqlLogger } from "~/lib/graphql/graphql_logger.service";
import { MyContext } from "~/lib/graphql/my_context";
import { ENV } from "~/config/environments";
import { CORS } from "~/config/cors";

export const graphqlConfig: GqlModuleOptions = {
  logger: new GraphqlLogger(),
  debug: ENV.enableDebugging,
  playground: ENV.enablePlayground,
  autoSchemaFile: "schema.graphql",
  cors: CORS,
  buildSchemaOptions: {
    numberScalarMode: "integer",
  },
  formatError: (error: GraphQLError): GraphQLFormattedError => ({
    message: error.extensions?.exception?.response?.message ?? error.message,
  }),
  context: ({ request, reply }): Partial<MyContext> => ({
    ipAddr: request?.ip,
    user: request?.user,
    req: request,
    res: reply,
  }),
};
