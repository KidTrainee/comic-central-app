// @flow

import React, { Component } from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import config from 'comicCentral/src/config';
import { colors, margins } from 'comicCentral/src/appStyle';

class Comic extends Component {
  props: PropsType;

  render() {
    const comic = this.props.comic;

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() =>
          this.props.onPress(this.props.comic._id, this.props.comic.path)}
      >
        <Image
          style={styles.cover}
          source={{ uri: `${config.host}${comic.coverUrl}` }}
        >
          <Text style={styles.name}>{comic.name}</Text>
        </Image>
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
    width: '33.3333%',
  },
  cover: {
    width: '100%',
    aspectRatio: 0.70,
    resizeMode: 'cover',
    backgroundColor: colors.comic.cover,
    justifyContent: 'flex-end',
  },
  name: {
    color: colors.comic.name,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: margins.xs,
    marginBottom: margins.sm,
  },
});

export default Comic;
