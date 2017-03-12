// @flow

import { call, put, takeEvery, spawn } from 'redux-saga/effects';
import RNFS from 'react-native-fs';
import config from 'comicCentral/src/config';

type StateType = {
  comics: {
    [keys: string]: ComicType,
  },
};

type ActionType = {
  type: string,
  payload: Object,
};

type ComicType = {
  error: ?string,
  isLoading: boolean,
  progress: number,
  data: ?Object,
};

export const defaultState: StateType = {
  comics: {},
};

export const actionTypes = {
  DOWNLOAD_FILE: 'DOWNLOAD.DOWNLOAD_FILE',
  DOWNLOAD_FILE_BEGIN: 'DOWNLOAD.DOWNLOAD_FILE_BEGIN',
  DOWNLOAD_FILE_FINISHED: 'DOWNLOAD.DOWNLOAD_FILE_FINISHED',
  DOWNLOAD_FILE_ERROR: 'DOWNLOAD.DOWNLOAD_FILE_ERROR',
  DOWNLOAD_FILE_PROGRESS: 'DOWNLOAD.DOWNLOAD_FILE_PROGRESS',
};

export function reducer(
  state: StateType = defaultState,
  action: ActionType
): StateType {
  switch (action.type) {
    case actionTypes.DOWNLOAD_FILE_BEGIN:
      return {
        comics: {
          ...state.comics,
          [action.payload._id]: {
            error: null,
            isLoading: true,
            progress: 0,
            data: null,
          },
        },
      };
    case actionTypes.DOWNLOAD_FILE_PROGRESS:
      return {
        comics: {
          ...state.comics,
          [action.payload._id]: {
            error: null,
            isLoading: true,
            progress: action.payload.progress,
            data: null,
          },
        },
      };
    case actionTypes.DOWNLOAD_FILE_ERROR:
      return {
        comics: {
          ...state.comics,
          [action.payload._id]: {
            error: action.payload.error,
            isLoading: false,
            progress: 0,
            data: null,
          },
        },
      };
    case actionTypes.DOWNLOAD_FILE_FINISHED:
      console.log('DONE');
      return {
        comics: {
          ...state.comics,
          [action.payload._id]: {
            error: null,
            isLoading: false,
            progress: 100,
            data: {},
          },
        },
      };
    default:
      return state;
  }
}

export const setFileFinished = (_id: string): ActionType => ({
  type: actionTypes.DOWNLOAD_FILE_FINISHED,
  payload: { _id },
});
export const setFileProgress = (_id: string, progress): ActionType => ({
  type: actionTypes.DOWNLOAD_FILE_PROGRESS,
  payload: { _id, progress },
});
export const setFileBegin = (_id: string): ActionType => ({
  type: actionTypes.DOWNLOAD_FILE_BEGIN,
  payload: { _id },
});
export const setFileError = (_id: string, error: string): ActionType => ({
  type: actionTypes.DOWNLOAD_FILE_ERROR,
  payload: { _id, error },
});
export const downloadFile = (_id: string, uri: string): ActionType => ({
  type: actionTypes.DOWNLOAD_FILE,
  payload: { _id, uri },
});

export function* saga() {
  yield takeEvery(actionTypes.DOWNLOAD_FILE, downloadFileSaga);
}

export function* setFileProgressSaga(_id, progress) {
  yield call(setFileProgress(_id, progress));
}

export function* setFileBeginSaga(_id) {
  yield call(setFileBegin(_id));
}

export function* downloadFileSaga(action: ActionType) {
  const { _id, uri } = action.payload;
  const url = `${config.host}/comics${uri}`.replace(/ /g, '%20');
  const file = `${RNFS.DocumentDirectoryPath}/${_id}.cbz`;

  try {
    const { promise, jobId } = RNFS.downloadFile({
      fromUrl: url,
      toFile: file,
      progressDivider: 5,
      begin: function() {
        put(setFileBegin(_id));
      },
      progress: function({ bytesWritten, contentLength }) {
        const progress = contentLength / bytesWritten;
        put(setFileProgress(_id, progress));
      },
    });
    const { statusCode } = yield call(p => p, promise);
    console.log(statusCode);
    yield put(setFileFinished(_id));
  } catch (err) {
    yield put(setFileError(_id, 'ERROR'));
  }
}
