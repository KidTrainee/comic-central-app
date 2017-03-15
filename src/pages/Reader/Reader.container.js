// @flow

import { connect } from 'react-redux';
import Reader from './Reader.component';
import { getDownloadPath } from 'comicCentral/src/modules/download';

const mapStateToProps = (state, ownprops) => ({
  filePath: getDownloadPath(state, ownprops.navigation.state.params._id),
});

export default connect(mapStateToProps)(Reader);
