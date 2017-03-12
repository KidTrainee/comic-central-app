import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
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
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
);

sagaMiddleware.run(saga);

export default store;
