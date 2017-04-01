// @flow

import React, { Component } from 'react';
import { StatusBar, DeviceEventEmitter } from 'react-native';
import { ApolloProvider } from 'react-apollo';

import Scenes from './Scenes';
import { client, store } from './modules';
import { Loader } from './components';

// global.XMLHttpRequest = global.originalXMLHttpRequest
//   ? global.originalXMLHttpRequest
//   : global.XMLHttpRequest;
// global.FormData = global.originalFormData
//   ? global.originalFormData
//   : global.FormData;

StatusBar.setBackgroundColor('#000');
StatusBar.setBarStyle('light-content');

class App extends Component {
  state = {
    isHydrated: false,
  };

  componentWillMount() {
    DeviceEventEmitter.once('HYDRATED', () => {
      this.setState({ isHydrated: true });
    });
  }

  render() {
    return (
      <ApolloProvider client={client} store={store}>
        {this.state.isHydrated ? <Scenes /> : <Loader />}
      </ApolloProvider>
    );
  }
}

export default App;
