// @flow

import React, { Component } from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';

class Folder extends Component {
  props: PropsType;

  render() {
    const folder = this.props.folder;

    return (
      <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
        <View style={styles.coverContainer}>
          <Image
            style={styles.cover}
            source={{ uri: `http://localhost:8888${folder.coverUrl}` }}
          />
        </View>
        <Text style={styles.name}>{folder.name}</Text>
      </TouchableOpacity>
    );
  }
}

type PropsType = {
  onPress: () => void,
  folder: {
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
  coverContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  cover: {
    borderRadius: 40,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  name: {
    marginTop: 4,
    color: 'white',
    textAlign: 'center',
  },
});

export default Folder;
