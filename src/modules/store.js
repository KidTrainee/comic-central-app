import { AsyncStorage, DeviceEventEmitter } from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, autoRehydrate } from 'redux-persist';
import client from './client';
import saga from './saga';
import reducer from './reducer';

const sagaMiddleware = createSagaMiddleware();
const appoloMiddleware = client.middleware();

const store = createStore(
  reducer,
  {},
  compose(
    applyMiddleware(sagaMiddleware, appoloMiddleware),
    autoRehydrate(),
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
);

persistStore(
  store,
  {
    storage: AsyncStorage,
    whitelist: ['downloads', 'apollo'],
  },
  () => DeviceEventEmitter.emit('HYDRATED')
);

sagaMiddleware.run(saga);

export default store;
