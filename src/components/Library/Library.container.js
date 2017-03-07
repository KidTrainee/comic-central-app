// @flow

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Library from './Library.component';

const FolderQuery = gql`
  query FolderQuery($_id: String) {
    folder(_id: $_id) {
      isRoot,
      name,
      folders {
        _id,
        name,
        coverUrl
      }
    }
  }
`;

export default graphql(FolderQuery, {
  options: ownProps => ({
    variables: {
      _id: ownProps.folderId,
    },
  }),
})(Library);
