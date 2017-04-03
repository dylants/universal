import bodyParser from 'body-parser';
import compression from 'compression';
import consolidate from 'consolidate';
import express from 'express';
import hook from 'css-modules-require-hook';
import path from 'path';
import sass from 'node-sass';

import config from '../config';

const APP_ROOT = path.join(__dirname, '../../');
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const app = express();

app.use(compression());
app.use(bodyParser.json());

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
  const webpackConfig = require('../../webpack.config.development');

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

/* ------------------------------------------ *
 * Express route configuration
 * ------------------------------------------ */

const router = new express.Router();
require('../routes/express-routes')(router);

app.use(router);


module.exports = app;
