// @flow
import React, { Component } from 'react';

import { Page, Library } from 'comicCentral/src/components';

class Home extends Component {
  static navigationOptions = {
    title: 'Home',
  };

  state: StateType = {
    folderId: null,
  };
  props: PropsType;

  render() {
    return (
      <Page noPadding>
        <Library
          onFolderSelect={folderId => this.setState({ folderId })}
          folderId={this.state.folderId}
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
