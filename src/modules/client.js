// @flow
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import config from 'comicCentral/src/config';

const networkInterface = createNetworkInterface({
  uri: `${config.host}${config.graphQLUri}`,
});

networkInterface.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};
      }
      req.options.headers['token'] = config.token;
      next();
    },
  },
]);

const client = new ApolloClient({
  networkInterface,
  addTypename: true,
  dataIdFromObject: result => {
    if (result._id && result.__typename) {
      return result.__typename + result._id;
    }
    return null;
  },
});

export default client;
