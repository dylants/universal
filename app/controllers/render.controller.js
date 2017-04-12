import _ from 'lodash';
import React from 'react';
import createMemoryHistory from 'history/createMemoryHistory';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { renderToString } from 'react-dom/server';

import configureStore from '../config/store';
import { routes } from '../routes/react-routes';

export default function render(req, res, next) {
  // create a new history and redux store on each (server side) request
  const history = createMemoryHistory(req.url);
  const store = configureStore(undefined, history);

  // determine the list of routes that match the incoming URL
  const matches = matchRoutes(routes, req.url);

  // build up the list of functions we should run prior to rendering
  const promises = matches.map(({ route }) => {
    // for each, return the fetchData Promise or a resolved Promise
    const fetchData = _.get(route, 'component.WrappedComponent.fetchData');
    return fetchData ? fetchData({ store }) : Promise.resolve();
  });

  // load all the data necessary to render the route
  return Promise.all(promises)
    .then(() => {
      // get the HTML content for our server side rendering
      const htmlContent = renderToString(
        <Provider store={store}>
          <StaticRouter history={history} location={req.url} context={{}}>
            {renderRoutes(routes)}
          </StaticRouter>
        </Provider>,
      );

      // get the state from the store to send it to the client
      // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
      const reduxState = JSON.stringify(store.getState()).replace(/</g, '\\u003c');

      // return the rendered index page with included HTML content and redux state
      return res.render('index', {
        reduxState,
        htmlContent,
      });
    })
    .catch(err => next(err));
}
