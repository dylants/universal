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

  const store = createStore(rootReducer, initialState, middleware);

  if (module.hot) {
    module.hot.accept('../reducers/root.reducer', () => {
      store.replaceReducer(rootReducer);
    });
  }

  return store;
}

export default configureStore;
