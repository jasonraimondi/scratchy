import { GqlModuleOptions } from "@nestjs/graphql";
import { GraphQLError, GraphQLFormattedError } from "graphql";

import { ENV } from "~/config/environments";
import { CORS } from "~/config/cors";
import { GraphqlLogger } from "~/lib/logger/graphql.logger";
import { MyContext } from "~/config/context";
import { join } from "path";

export const graphqlConfig: GqlModuleOptions = {
  logger: new GraphqlLogger(),
  debug: ENV.isDebug,
  playground: ENV.isDevelopment,
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  cors: CORS,
  buildSchemaOptions: {
    numberScalarMode: "integer",
  },
  formatError: (error: GraphQLError): GraphQLFormattedError => ({
    message: error.message,
  }),
  context: ({ request, reply }): Partial<MyContext> => ({
    ipAddr: request?.ip ?? "127.0.0.3",
    user: request?.user,
    req: request,
    res: reply,
  }),
};
