// @flow

import { eventChannel, END, buffers } from 'redux-saga';
import {
  call,
  put,
  actionChannel,
  spawn,
  fork,
  take,
  takeEvery,
} from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';
import RNFS from 'react-native-fs';
import config from 'comicCentral/src/config';

type StateType = {
  comics: {
    [keys: string]: ComicType,
  },
};

type ComicType = {
  error: ?string,
  isLoading: boolean,
  isQueued: boolean,
  progress: number,
  isLoaded: boolean,
  filePath: ?string,
};

export const defaultState: StateType = {
  comics: {},
};

export const actionTypes = {
  DOWNLOAD_FILE: 'DOWNLOAD.DOWNLOAD_FILE',
  DOWNLOAD_FILE_QUEUE: 'DOWNLOAD.DOWNLOAD_FILE_QUEUE',
  DOWNLOAD_FILE_BEGIN: 'DOWNLOAD.DOWNLOAD_FILE_BEGIN',
  DOWNLOAD_FILE_QUEUED: 'DOWNLOAD.DOWNLOAD_FILE_QUEUED',
  DOWNLOAD_FILE_FINISHED: 'DOWNLOAD.DOWNLOAD_FILE_FINISHED',
  DOWNLOAD_FILE_ERROR: 'DOWNLOAD.DOWNLOAD_FILE_ERROR',
  DOWNLOAD_FILE_PROGRESS: 'DOWNLOAD.DOWNLOAD_FILE_PROGRESS',
};

export function reducer(
  state: StateType = defaultState,
  action: ActionType
): StateType {
  switch (action.type) {
    case actionTypes.DOWNLOAD_FILE_QUEUED:
      return {
        comics: {
          ...state.comics,
          [action.payload._id]: {
            error: null,
            isLoading: false,
            isQueued: true,
            isLoaded: false,
            filePath: null,
            progress: 0,
            data: null,
          },
        },
      };
    case actionTypes.DOWNLOAD_FILE_BEGIN:
      return {
        comics: {
          ...state.comics,
          [action.payload._id]: {
            error: null,
            isLoading: true,
            isQueued: false,
            isLoaded: false,
            filePath: null,
            progress: 0,
            data: null,
          },
        },
      };
    case actionTypes.DOWNLOAD_FILE_PROGRESS:
      const _id = action.payload._id;
      return {
        comics: {
          ...state.comics,
          [_id]: {
            ...state.comics[_id],
            progress: action.payload.progress,
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
            isQueued: false,
            isLoaded: false,
            filePath: null,
            progress: 0,
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
            isQueued: false,
            isLoaded: true,
            filePath: action.payload.filePath,
            progress: 1,
          },
        },
      };
    default:
      return state;
  }
}

export const getDownload = (state: any, _id: string) =>
  state.downloads.comics[_id] || {};

export const getDownloadPath = (state: any, _id: string) =>
  state.downloads.comics[_id].filePath;

export const setFileFinished = (_id: string, filePath: string): ActionType => ({
  type: actionTypes.DOWNLOAD_FILE_FINISHED,
  payload: { _id, filePath },
});
export const setFileProgress = (_id: string, progress: number): ActionType => ({
  type: actionTypes.DOWNLOAD_FILE_PROGRESS,
  payload: { _id, progress },
});
export const setFileBegin = (_id: string): ActionType => ({
  type: actionTypes.DOWNLOAD_FILE_BEGIN,
  payload: { _id },
});
export const setFileQueued = (_id: string): ActionType => ({
  type: actionTypes.DOWNLOAD_FILE_QUEUED,
  payload: { _id },
});
export const setFileError = (_id: string, error: string): ActionType => ({
  type: actionTypes.DOWNLOAD_FILE_ERROR,
  payload: { _id, error },
});
export const downloadFileQueue = (_id: string, uri: string): ActionType => ({
  type: actionTypes.DOWNLOAD_FILE_QUEUE,
  payload: { _id, uri },
});
export const downloadFile = (_id: string, uri: string): ActionType => ({
  type: actionTypes.DOWNLOAD_FILE,
  payload: { _id, uri },
});

export function* saga(): * {
  yield fork(watchDownloadFile);
  yield fork(watchDownloadFileQueue);
}

export function* watchDownloadFile(): * {
  yield takeEvery(actionTypes.DOWNLOAD_FILE, function*(action: ActionType) {
    const { _id, uri } = action.payload;
    yield put(setFileQueued(_id));
    yield put(downloadFileQueue(_id, uri));
  });
}

export function* watchDownloadFileQueue(): * {
  const requestChan = yield actionChannel(
    actionTypes.DOWNLOAD_FILE_QUEUE,
    buffers.expanding(1)
  );
  while (true) {
    const action = yield take(requestChan);
    yield downloadFileSaga(action);
  }
}

export function downloadFileSagaHelper(_id: string, uri: string) {
  const url = `${config.host}/comics${uri}`.replace(/ /g, '%20');
  const filePath = `${RNFS.DocumentDirectoryPath}/${_id}.cbz`;

  return eventChannel(emitter => {
    const { promise, jobId } = RNFS.downloadFile({
      fromUrl: url,
      toFile: filePath,
      headers: {
        token: config.token,
      },
      progressDivider: 10,
      begin: () => {
        emitter(setFileBegin(_id));
      },
      progress: ({ bytesWritten, contentLength }) => {
        const progress = bytesWritten / contentLength;
        emitter(setFileProgress(_id, progress));
      },
    });

    promise
      .then(() => {
        emitter(setFileFinished(_id, filePath));
        emitter(END);
      })
      .catch(err => {
        emitter(setFileError(_id, 'Error'));
        emitter(END);
      });

    return () => {
      RNFS.stopDownload(jobId);
    };
  });
}

export function* downloadFileSaga(action: ActionType): * {
  const { _id, uri } = action.payload;
  const channel = yield call(downloadFileSagaHelper, _id, uri);

  try {
    while (true) {
      let action = yield take(channel);
      yield put(action);
    }
  } catch (err) {}
}
