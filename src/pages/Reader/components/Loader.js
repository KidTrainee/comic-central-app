// @flow

import React, { Component } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { margins, colors } from 'comicCentral/src/appStyle';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  text: {
    color: 'white',
    marginTop: margins.sm,
  },
});

class Loader extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.text}>Loading comic</Text>
      </View>
    );
  }
}

export default Loader;
