// @flow

import React, { Component } from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

class Folder extends Component {
  props: PropsType;

  render() {
    const folder = this.props.folder;

    return (
      <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
        <Image
          style={styles.cover}
          source={{ uri: `http://localhost:8888${folder.coverUrl}` }}
        />
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
  cover: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: 'cover',
    backgroundColor: 'white',
  },
  name: {
    marginTop: 4,
    color: 'white',
    textAlign: 'center',
  },
});

export default Folder;
