import ApolloClient, { createNetworkInterface } from 'apollo-client';
import config from 'comicCentral/src/config';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: `${config.host}${config.graphQLUri}`,
  }),
  addTypename: true,
  dataIdFromObject: result => {
    if (result._id && result.__typename) {
      return result.__typename + result._id;
    }
    return null;
  },
});

export default client;
