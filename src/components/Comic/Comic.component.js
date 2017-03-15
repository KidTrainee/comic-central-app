// @flow

import React, { Component } from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';
import config from 'comicCentral/src/config';
import { colors, margins } from 'comicCentral/src/appStyle';
import Icon from 'react-native-vector-icons/FontAwesome';

class Comic extends Component {
  props: PropsType;

  onPress = () => {};

  render() {
    const { comic, download } = this.props;
    const progressStyle = download.isLoading
      ? { width: `${download.progress * 100}%` }
      : null;

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => this.props.onPress(comic._id, comic.path)}
        disabled={download.isLoaded}
      >
        <Image
          style={styles.cover}
          source={{ uri: `${config.host}${comic.coverUrl}` }}
        >
          <View style={styles.nameContainer}>
            <View style={[styles.nameProgress, progressStyle]} />
            <Text style={styles.name}>
              {comic.name}
            </Text>
          </View>
          {download.isLoaded &&
            <View style={styles.iconContainer}>
              <Icon name="download" style={styles.icon} />
            </View>}
        </Image>
      </TouchableOpacity>
    );
  }
}

type PropsType = {
  onPress: () => void,
  download: any,
  comic: {
    _id: string,
    name: string,
    coverUrl: string,
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
  iconContainer: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: margins.xs,
    right: margins.xs,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: 'white',
  },
});

export default Comic;
