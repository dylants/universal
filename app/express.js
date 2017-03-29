import consolidate from 'consolidate';
import express from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';

import routes from './routes';

const APP_ROOT = path.join(__dirname, '../');
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const logger = require('./lib/logger')();

const app = express();

// use handlebars as the html engine renderer
app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
// set this location explicitly for both development and production
app.set('views', path.join(APP_ROOT, 'app', 'views'));

if (IS_DEVELOPMENT) {
  // only load these dependencies if we are not in production to avoid
  // requiring them in production mode (when they are only required in dev)
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../webpack.config.development');

  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: 'minimal',
  }));
  app.use(webpackHotMiddleware(compiler));
}

if (IS_PRODUCTION) {
  // serve the static assets (js/css)
  app.use(express.static(path.join(APP_ROOT, 'public')));
}

/*
 * THIS MUST BE THE LAST ROUTE IN THE CONFIG
 * This renders any other request according to the match rules below
 */
app.get('*', (req, res) => {
  logger.log(req.url);
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      logger.error('express: error rendering route, req.url: %s', req.url);
      logger.error(error);
      return res.status(500).send(error.message);
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (!renderProps) {
      return res.status(404).end();
    }

    const webpackBundleName = IS_DEVELOPMENT ? 'main.js' : 'main.min.js';

    // with no errors and no redirects, render the page
    return res.render('index', {
      webpackBundleName,
      htmlContent: renderToString(<RouterContext {...renderProps} />),
    });
  });
});

module.exports = app;
