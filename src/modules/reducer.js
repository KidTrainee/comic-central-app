import { combineReducers } from 'redux';
import { reducer as downloadReducer } from './download';
import { reducer as readerReducer } from './reader';
import client from './client';

export default combineReducers({
  downloads: downloadReducer,
  reader: readerReducer,
  apollo: client.reducer(),
});
