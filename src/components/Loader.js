// @flow

import React, { PureComponent } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from 'comicCentral/src/appStyle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});

class Loader extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="white" size="large" />
      </View>
    );
  }
}

export default Loader;
