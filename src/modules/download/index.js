// @flow

import { eventChannel, END } from 'redux-saga';
import { call, put, takeEvery, spawn, fork, take } from 'redux-saga/effects';
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

export function downloadFileSagaHelper(_id, uri) {
  const url = `${config.host}/comics${uri}`.replace(/ /g, '%20');
  const file = `${RNFS.DocumentDirectoryPath}/${_id}.cbz`;

  return eventChannel(emitter => {
    const { promise, jobId } = RNFS.downloadFile({
      fromUrl: url,
      toFile: file,
      progressDivider: 5,
      begin: () => {
        emitter(setFileBegin(_id));
      },
      progress: ({ bytesWritten, contentLength }) => {
        const progress = contentLength / bytesWritten;
        emitter(setFileProgress(_id, progress));
      },
    });

    promise.then(() => {
      emitter(setFileFinished(_id));
      emitter(END);
    });

    return () => {
      RNFS.stopDownload(jobId);
    };
  });
}

export function* downloadFileSaga(action: ActionType) {
  console.log('DOWNLOAD');
  const { _id, uri } = action.payload;
  const channel = yield call(downloadFileSagaHelper, _id, uri);

  try {
    while (true) {
      let action = yield take(channel);
      yield put(action);
    }
  } finally {
    console.log('Terminated');
  }
}
