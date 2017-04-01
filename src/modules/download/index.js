// @flow

import { eventChannel, END, buffers } from 'redux-saga';
import {
  call,
  put,
  select,
  actionChannel,
  spawn,
  fork,
  take,
  takeEvery,
} from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';
import RNFetch from 'react-native-fetch-blob';
import config from 'comicCentral/src/config';
import { getComic } from '../appolo';

type StateType = {
  comics: {
    [keys: string]: DownloadType,
  },
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
  DELETE_FILE: 'DOWNLOAD.DELETE_FILE',
  DELETE_FILE_FINISHED: 'DOWNLOAD.DELETE_FILE_FINISHED',
};

export function reducer(
  state: StateType = defaultState,
  action: ActionType<*>
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
    case actionTypes.DELETE_FILE_FINISHED:
      return {
        comics: {
          ...state.comics,
          [action.payload._id]: {
            error: null,
            isLoading: false,
            isQueued: false,
            isLoaded: false,
            filePath: null,
            progress: 0,
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

export const downloadFile = (_id: string): ActionType<*> => ({
  type: actionTypes.DOWNLOAD_FILE,
  payload: { _id },
});

export const deleteFile = (_id: string): ActionType<*> => ({
  type: actionTypes.DELETE_FILE,
  payload: { _id },
});

export function* saga(): * {
  yield fork(watchDownloadFileSaga);
  yield fork(watchDownloadFileQueueSaga);
  yield fork(watchDeleteFileSaga);
}

export function* watchDownloadFileSaga(): * {
  yield takeEvery(actionTypes.DOWNLOAD_FILE, function*(action: ActionType<*>) {
    const { _id, uri } = action.payload;
    yield put({
      type: actionTypes.DOWNLOAD_FILE_QUEUED,
      payload: { _id },
    });
    yield put({
      type: actionTypes.DOWNLOAD_FILE_QUEUE,
      payload: { _id },
    });
  });
}

export function* watchDownloadFileQueueSaga(): * {
  const requestChan = yield actionChannel(
    actionTypes.DOWNLOAD_FILE_QUEUE,
    buffers.expanding(1)
  );
  while (true) {
    const action = yield take(requestChan);
    yield downloadFileSaga(action);
  }
}

export function* watchDeleteFileSaga(): * {
  yield takeEvery(actionTypes.DELETE_FILE, deleteFileSaga);
}

export function downloadFileSagaHelper(comic: ComicType, uri: string) {
  const { _id, path } = comic;
  const url = `${config.host}/comics${path}`.replace(/ /g, '%20');
  const filePath = `${RNFetch.fs.dirs.MainBundleDir}/${_id}.cbz`;

  return eventChannel(emitter => {
    const task = RNFetch.config({
      path: filePath,
      addAndroidDownloads: {
        useDownloadManager: true,
        title: comic.name,
        notification: true,
      },
    })
      .fetch('GET', url, {
        token: config.token,
      })
      .progress({ interval: 200 }, (received, total) => {
        const progress = received / total * 100;
        emitter({
          type: actionTypes.DOWNLOAD_FILE_PROGRESS,
          payload: { _id, progress },
        });
      })
      .then(res => {
        emitter({
          type: actionTypes.DOWNLOAD_FILE_FINISHED,
          payload: { _id, filePath: res.path() },
        });
        emitter(END);
      })
      .catch(error => {
        emitter({
          type: actionTypes.DOWNLOAD_FILE_ERROR,
          payload: { _id, error },
        });
        emitter(END);
      });

    return () => {
      task.cancel();
    };
  });
}

export function* downloadFileSaga(action: ActionType<{ _id: string }>): * {
  const { _id } = action.payload;
  const comic = yield select(getComic, _id);
  yield put({
    type: actionTypes.DOWNLOAD_FILE_BEGIN,
    payload: { _id },
  });
  const channel = yield call(downloadFileSagaHelper, comic);

  try {
    while (true) {
      let action = yield take(channel);
      yield put(action);
    }
  } catch (err) {}
}

export function* deleteFileSaga(action: ActionType<{ _id: string }>): * {
  const { _id } = action.payload;
  const path = yield select(getDownloadPath, _id);
  yield call(RNFetch.fs.unlink, path);
  yield put({
    type: actionTypes.DELETE_FILE_FINISHED,
    payload: { _id },
  });
}
