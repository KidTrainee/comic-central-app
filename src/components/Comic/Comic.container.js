// @flow

import { connect } from 'react-redux';
import Comic from './Comic.component';
import {
  downloadFile,
  deleteFile,
  getDownload,
} from 'comicCentral/src/modules/download';
import config from 'comicCentral/src/config';

const mapStateToProps = (state, ownprops) => ({
  download: getDownload(state, ownprops.comic._id),
});

const mapDispatchToProps = {
  onDownload: downloadFile,
  onDelete: deleteFile,
};

export default connect(mapStateToProps, mapDispatchToProps)(Comic);
