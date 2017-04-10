/* global window, document */

import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';

import configureStore from './store';
import { routes } from '../routes/react-routes';

const initialState = window.__REDUX_STATE__;
delete window.__REDUX_STATE__;

const history = createBrowserHistory();
const store = configureStore(initialState, history);

function render(routesToRender) {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        {renderRoutes(routesToRender)}
      </ConnectedRouter>
    </Provider>,
    document.getElementById('app'),
  );
}

render(routes);

if (module.hot) {
  module.hot.accept('../routes/react-routes', () => {
    render(routes);
  });
}
