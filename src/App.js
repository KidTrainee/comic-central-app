// @flow

import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';

import Scenes from './Scenes';
import client from './client';

class App extends Component {

  render() {
    return (
      <ApolloProvider client={client}>
        <Scenes />
      </ApolloProvider>
    );
  }
}

export default App;
