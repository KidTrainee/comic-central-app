import { combineReducers } from 'redux';
import { reducer as downloadReducer } from './download';
import client from './client';

export default combineReducers({
  downloads: downloadReducer,
  apollo: client.reducer(),
});
