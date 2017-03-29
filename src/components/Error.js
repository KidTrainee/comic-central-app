// @flow

import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: 'white',
    fontSize: 16,
  },
});

class Loader extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Failed to load library</Text>
      </View>
    );
  }
}

export default Loader;
