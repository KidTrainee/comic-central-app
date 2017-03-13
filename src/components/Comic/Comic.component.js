// @flow

import React, { Component } from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';
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
          <View style={styles.nameContainer}>
            <View style={styles.nameProgress} />
            <Text style={styles.name}>{comic.name}</Text>
          </View>
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
  nameContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: margins.xs,
    marginBottom: margins.sm,
  },
  nameProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '0%',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  name: {
    color: colors.comic.name,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});

export default Comic;
