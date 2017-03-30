import bodyParser from 'body-parser';
import compression from 'compression';
import consolidate from 'consolidate';
import express from 'express';
import glob from 'glob';
import path from 'path';

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

/* ------------------------------------------ *
 * Development environment configuration
 * ------------------------------------------ */

if (IS_DEVELOPMENT) {
  /*
   * only load these dependencies if we are not in production to avoid
   * requiring them in production mode (since they are only required in dev)
   */

  // this is required to get babel to process css-modules
  const hook = require('css-modules-require-hook');
  const sass = require('node-sass');
  hook({
    extensions: ['.scss', '.css'],
    generateScopedName: config.webpack.localIdentName,
    preprocessCss: (data, file) => sass.renderSync({ file }).css,
  });

  // configure webpack middleware
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

/* ------------------------------------------ *
 * Production environment configuration
 * ------------------------------------------ */

if (IS_PRODUCTION) {
  /*
   * Our components import styles (scss files) even after babel compilation.
   * But since we export our styles to an external css file in production,
   * we can ignore them in the (compiled) production code.
   */
  require('ignore-styles');

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
