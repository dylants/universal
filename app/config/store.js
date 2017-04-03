import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import rootReducer from '../reducers/root.reducer';

const loggerOptions = {
  // only log when in development environment
  predicate: () => process.env.NODE_ENV === 'development',
};
// special options only used on the server side
if (typeof window === 'undefined') {
  Object.assign(loggerOptions, {
    colors: false,
  });
}
const logger = createLogger(loggerOptions);

function configureStore(initialState, history) {
  const middleware = applyMiddleware(
    thunkMiddleware,
    routerMiddleware(history),
    logger,
  );

  return createStore(rootReducer, initialState, middleware);
}

export default configureStore;
