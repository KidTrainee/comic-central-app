// @flow

import React, { Component } from 'react';
import { Image } from 'react-native';
import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';
import { Page } from 'comicCentral/src/components';

class Reader extends Component {
  static navigationOptions = {
    title: 'Reader',
  };

  state = {
    isLoading: true,
    error: null,
    files: null,
    fileIndex: 0,
    currentFile: null,
  };

  componentDidMount() {
    const outputPath = `${RNFS.DocumentDirectoryPath}/current`;
    RNFS.unlink(outputPath)
      .catch(() => {})
      .then(() => RNFS.mkdir(outputPath))
      .then(() => unzip(this.props.filePath, outputPath))
      .then(() => RNFS.readDir(outputPath))
      .then(files => {
        this.setState({
          files,
          fileIndex: 0,
          isLoading: false,
          currentFile: `file://${files[0].path}`,
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    if (this.state.isLoading) return null;
    if (this.state.error)
      return <Text style={{ color: 'white' }}>{this.state.error}</Text>;

    return (
      <Page noPadding>
        <Image
          source={{ uri: this.state.currentFile }}
          style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
        />
      </Page>
    );
  }
}

export default Reader;
