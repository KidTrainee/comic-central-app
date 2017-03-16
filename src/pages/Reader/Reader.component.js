// @flow

import React, { Component } from 'react';
import {
  Image,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';
import { Page } from 'comicCentral/src/components';
import Loader from './components/Loader';

const styles = StyleSheet.create({
  buttonContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  buttonSide: {
    width: '30%',
  },
  buttonCenter: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

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

  nextPage = () => {
    if (this.state.fileIndex + 1 < this.state.files.length) {
      const fileIndex = this.state.fileIndex + 1;
      const currentFile = `file://${this.state.files[fileIndex].path}`;
      this.setState({
        fileIndex,
        currentFile,
      });
    }
  };

  previousPage = () => {
    if (this.state.fileIndex > 0) {
      const fileIndex = this.state.fileIndex - 1;
      const currentFile = `file://${this.state.files[fileIndex].path}`;
      this.setState({
        fileIndex,
        currentFile,
      });
    }
  };

  render() {
    if (this.state.isLoading) return <Loader />;
    if (this.state.error)
      return <Text style={{ color: 'white' }}>{this.state.error}</Text>;

    return (
      <Page noPadding>
        <Image source={{ uri: this.state.currentFile }} style={styles.image} />
        <View style={styles.buttonContainer}>
          <TouchableWithoutFeedback onPress={this.previousPage}>
            <View style={styles.buttonSide} />
          </TouchableWithoutFeedback>
          <View style={styles.buttonCenter} />
          <TouchableWithoutFeedback onPress={this.nextPage}>
            <View style={styles.buttonSide} />
          </TouchableWithoutFeedback>
        </View>
      </Page>
    );
  }
}

export default Reader;
