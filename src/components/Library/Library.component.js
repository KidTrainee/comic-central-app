// @flow

import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
} from 'react-native';
import Folder from '../Folder';
import Comic from '../Comic';
import Loader from '../Loader';
import Error from '../Error';

class Library extends PureComponent {
  props: PropsType;

  render() {
    if (this.props.data.loading) {
      return <Loader />;
    }

    if (this.props.data.error) {
      return <Error onRetry={() => this.props.data.refetch()} />;
    }

    return (
      <ScrollView>
        <View style={styles.container}>
          {this.props.data.folder.folders.map(folder => (
            <Folder
              key={folder._id}
              folder={folder}
              onPress={() =>
                this.props.onFolderSelect({
                  _id: folder._id,
                  name: folder.name,
                })}
            />
          ))}
          {this.props.data.folder.comics.map(folder => (
            <Comic
              key={folder._id}
              comic={folder}
              onRead={this.props.onComicRead}
            />
          ))}
        </View>
      </ScrollView>
    );
  }
}

type PropsType = {
  folderId: String,
  onFolderSelect: ({ _id: string, name: string }) => void,
  onComicRead: (_id: string) => void,
  data: {
    loading: boolean,
    error: Object,
    folder: Object,
    refetch: () => void,
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
