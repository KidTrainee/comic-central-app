// @flow

import React, { PureComponent } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
import Folder from '../Folder';

class Library extends PureComponent {
  props: PropsType;

  render() {
    if (this.props.data.loading) {
      return (<ActivityIndicator size="large" />);
    }

    if (this.props.data.error) {
      console.log(this.props.data.error);
      return (<Text>Error</Text>);
    }

    return (
      <ScrollView>
        <View style={styles.container}>
          { this.props.data.folder.folders.map(folder => (
            <Folder
              key={folder._id}
              folder={folder}
              onPress={() => this.props.onFolderSelect(folder._id)}
            />
          ))}
        </View>
      </ScrollView>
    );
  }
}

type PropsType = {
  folderId: String,
  onFolderSelect: (_id: String) => void,
  data: {
    loading: boolean,
    error: Object,
    folder: Object,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});

export default Library;
