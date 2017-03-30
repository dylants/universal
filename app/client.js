/* global window, document */

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './store/configureStore';
import { createRoutes } from './routes';

const initialState = window.__REDUX_STATE__;
delete window.__REDUX_STATE__;

const store = configureStore(initialState, browserHistory);
const history = syncHistoryWithStore(browserHistory, store);
const routes = createRoutes(history);

render(
  <Provider store={store}>
    {routes}
  </Provider>,
  document.getElementById('app'),
);
