import { GraphQLClient } from 'graphql-request';
import { getSdk } from './generated/graphql';
import type { SdkFunctionWrapper } from './generated/graphql';

export default function (graphqlLink = `https://scratchy.localdomain/api/graphql`) {
	const graphQLClient = new GraphQLClient(graphqlLink, {
		credentials: 'same-origin'
	});

	const clientTimingWrapper: SdkFunctionWrapper = async <T>(action: () => Promise<T>): Promise<T> => {
		const startTime = Date.now();
		const result = await action();
		console.log(`request duration ${Date.now() - startTime}ms`);
		return result;
	};

	const graphQLSdk = getSdk(graphQLClient, clientTimingWrapper);

	return { graphQLClient, graphQLSdk };
}
