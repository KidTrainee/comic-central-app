import ApolloClient, { createNetworkInterface } from 'apollo-client';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'http://localhost:8888/GraphQL' }),
});

export default client;
