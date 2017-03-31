import bodyParser from 'body-parser';
import compression from 'compression';
import consolidate from 'consolidate';
import express from 'express';
import glob from 'glob';
import hook from 'css-modules-require-hook';
import path from 'path';
import sass from 'node-sass';

import config from './config';

const APP_ROOT = path.join(__dirname, '../');
const API_ROOT = path.join(__dirname, 'api');
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const app = express();

app.use(compression());

/* ------------------------------------------ *
 * API configuration
 * ------------------------------------------ */

app.use(bodyParser.json());

// load the server controllers (via the routes)
const ROUTE_PATH = path.join(API_ROOT, 'routes');
const router = new express.Router();
glob(`${ROUTE_PATH}/**/*.js`, (err, files) => {
  files.map(file => require(file)(router));
});
app.use(router);

// if at this point we don't have a route match for /api, return 404
app.all('/api/*', (req, res) => {
  res.status(404).send({
    error: `route not found: ${req.url}`,
  });
});

/* ------------------------------------------ *
 * Rendering configuration
 * ------------------------------------------ */

// use handlebars as the html engine renderer
app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
// set this location explicitly (for both development and production)
app.set('views', path.join(APP_ROOT, 'app', 'views'));

// this is required to get babel (server side) to process css-modules
hook({
  extensions: ['.scss', '.css'],
  generateScopedName: config.webpack.localIdentName,
  preprocessCss: (data, file) => sass.renderSync({ file }).css,
});


/* ------------------------------------------ *
 * Development environment configuration
 * ------------------------------------------ */

if (IS_DEVELOPMENT) {
  /*
   * only load these dependencies if we are not in production to avoid
   * requiring them in production mode (since they are only required in dev)
   */
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../webpack.config.development');

  // configure webpack middleware
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: 'minimal',
  }));
  app.use(webpackHotMiddleware(compiler));
}

/* ------------------------------------------ *
 * Production environment configuration
 * ------------------------------------------ */

if (IS_PRODUCTION) {
  // serve the static assets (js/css)
  app.use(express.static(path.join(APP_ROOT, 'public')));
}

// this must be imported at this point to avoid problems
const serverRender = require('./server-render').default;

/*
 * THIS MUST BE THE LAST ROUTE IN THE CONFIG
 * This renders any other request according to the match rules below
 */
app.get('*', serverRender);

module.exports = app;
