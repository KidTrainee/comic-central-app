// @flow

import React, { Component } from 'react';
import {
  Image,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
} from 'react-native';
import { Page } from 'comicCentral/src/components';
import { loadFiles, outputPath } from 'comicCentral/src/services/zip';
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
    this.load();
  }

  load = () => {
    loadFiles(this.props.filePath)
      .then(files => {
        this.setState({
          files,
          fileIndex: 0,
          isLoading: false,
          currentFile: `file://${outputPath}/${files[0]}`,
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isLoading: false,
          currentFile: null,
          error: 'ERROR',
        });
      });
  };

  nextPage = () => {
    if (this.state.fileIndex + 1 < this.state.files.length) {
      const fileIndex = this.state.fileIndex + 1;
      const currentFile = `file://${outputPath}/${this.state.files[fileIndex]}`;
      this.setState({
        fileIndex,
        currentFile,
      });
    }
  };

  previousPage = () => {
    if (this.state.fileIndex > 0) {
      const fileIndex = this.state.fileIndex - 1;
      const currentFile = `file://${outputPath}/${this.state.files[fileIndex]}`;
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
