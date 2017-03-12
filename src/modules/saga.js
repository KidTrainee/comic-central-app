import { fork } from 'redux-saga/effects';
import { saga as downloadSaga } from './download';

export default function*() {
  yield fork(downloadSaga);
}
