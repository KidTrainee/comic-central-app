// @flow

import { connect } from 'react-redux';
import Comic from './Comic.component';
import { downloadFile } from 'comicCentral/src/modules/download';
import RNFS from 'react-native-fs';
import config from 'comicCentral/src/config';
import { getDownload } from 'comicCentral/src/modules/download';

const mapStateToProps = (state, ownprops) => ({
  download: getDownload(state, ownprops.comic._id),
});

const mapDispatchToProps = dispatch => ({
  onPress: (_id, uri) => {
    dispatch(downloadFile(_id, uri));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Comic);
