import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import rootReducer from '../reducers/root.reducer';

const logger = createLogger({
  // only log when in development environment
  predicate: () => process.env.NODE_ENV === 'development',
});

function configureStore(initialState, history) {
  const middleware = applyMiddleware(
    thunkMiddleware,
    routerMiddleware(history),
    logger,
  );

  return createStore(rootReducer, initialState, middleware);
}

export default configureStore;
