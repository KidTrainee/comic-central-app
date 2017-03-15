// @flow
import React, { Component } from 'react';

import { Page, Library } from 'comicCentral/src/components';

class LibraryPage extends Component {
  static navigationOptions = {
    title: ({ state }) => state.params ? state.params.folderName : 'Librairie',
  };

  props: PropsType;

  render() {
    const { state, navigate } = this.props.navigation;

    return (
      <Page noPadding>
        <Library
          onFolderSelect={({ _id, name }) =>
            navigate('library', { folderId: _id, folderName: name })}
          folderId={state.params ? state.params.folderId : null}
          onComicRead={comicId => {
            this.props.navigation.navigate('reader', { _id: comicId });
          }}
        />
      </Page>
    );
  }
}

type PropsType = {
  navigation: any,
};

type StateType = {
  folderId: ?String,
};

export default LibraryPage;
