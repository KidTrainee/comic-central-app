// @flow
import React, { Component } from 'react';

import { Page, Library } from 'comicCentral/src/components';

class Home extends Component {
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
            navigate('home', { folderId: _id, folderName: name })}
          folderId={state.params ? state.params.folderId : null}
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

export default Home;
