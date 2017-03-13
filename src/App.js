// @flow

import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { ApolloProvider } from 'react-apollo';

import Scenes from './Scenes';
import { client, store } from './modules';

StatusBar.setBackgroundColor('#000');
StatusBar.setBarStyle('light-content');

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client} store={store}>
        <Scenes />
      </ApolloProvider>
    );
  }
}

export default App;
