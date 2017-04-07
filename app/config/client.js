/* global window, document */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './store';
import { createRoutes } from '../routes/react-routes';

const initialState = window.__REDUX_STATE__;
delete window.__REDUX_STATE__;

const store = configureStore(initialState, browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

function render(routes) {
  ReactDOM.render(
    <Provider store={store}>
      {routes}
    </Provider>,
    document.getElementById('app'),
  );
}

render(createRoutes(history));

if (module.hot) {
  module.hot.accept('../routes/react-routes', () => {
    render(createRoutes(history));
  });
}
