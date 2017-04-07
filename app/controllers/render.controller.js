import React from 'react';
import { renderToString } from 'react-dom/server';
import { createMemoryHistory, match, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';

import configureStore from '../config/store';
import { createRoutes } from '../routes/react-routes';

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const logger = require('../lib/logger')();

export default function render(req, res, next) {
  const history = createMemoryHistory(req.url);
  const store = configureStore(undefined, history);
  const syncedHistory = syncHistoryWithStore(history, store);
  const routes = createRoutes(syncedHistory);

  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      logger.error('render: error rendering route, req.url: %s', req.url);
      logger.error(error);
      return res.status(500).send(error.message);
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    // if there's no renderProps, assume no route matched the URL, so 404
    if (!renderProps) {
      return res.status(404).end();
    }

    /*
     * We need to load the data for the rendered container if necessary. We do this by
     * first loading the component, then grabbing its `fetchData` function, and calling
     * it. When it completes, we get the state and render the page.
     */
    // load the container from the render props
    const Component = renderProps.components[renderProps.components.length - 1].WrappedComponent;
    // grab the fetchData if it exists, else substitute an no-op function
    const fetchData = (Component && Component.fetchData) || (() => Promise.resolve());
    // execute the fetchData function, passing in available state
    return fetchData({ store })
      .then(() => {
        // get the state from the store, use it to render the HTML content
        // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
        const reduxState = JSON.stringify(store.getState()).replace(/</g, '\\u003c');
        const htmlContent = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>,
        );

        const webpackBundleName = IS_DEVELOPMENT ? 'main.js' : 'main.min.js';
        const webpackVendorBundleName = IS_DEVELOPMENT ? 'vendor.js' : 'vendor.min.js';
        // the css file is only available in production
        const stylesBundleName = IS_PRODUCTION && 'main.min.css';

        return res.render('index', {
          webpackBundleName,
          webpackVendorBundleName,
          stylesBundleName,
          reduxState,
          htmlContent,
        });
      })
      .catch(err => next(err));
  });
}
