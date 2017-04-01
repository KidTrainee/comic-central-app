// @flow

import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
  button: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  buttonText: {
    color: 'black',
  },
});

class Loader extends PureComponent {
  props: PropsType;

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Failed to load library</Text>
        <TouchableOpacity onPress={this.props.onRetry}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Retry</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

type PropsType = {
  onRetry: () => void,
};

export default Loader;
