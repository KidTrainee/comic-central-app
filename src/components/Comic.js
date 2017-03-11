// @flow

import React, { Component } from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import config from 'comicCentral/src/config';

class Comic extends Component {
  props: PropsType;

  render() {
    const comic = this.props.comic;

    return (
      <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
        <Image
          style={styles.cover}
          source={{ uri: `${config.host}${comic.coverUrl}` }}
        />
        <Text style={styles.name}>{comic.name}</Text>
      </TouchableOpacity>
    );
  }
}

type PropsType = {
  onPress: () => void,
  comic: {
    title: String,
    coverUrl: String,
  },
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '25%',
    paddingVertical: 4,
  },
  cover: {
    width: '100%',
    aspectRatio: 0.75,
    resizeMode: 'cover',
    backgroundColor: 'gray',
  },
  name: {
    marginTop: 4,
    color: 'black',
    textAlign: 'center',
  },
});

export default Comic;
