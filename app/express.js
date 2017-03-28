import consolidate from 'consolidate';
import express from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';

import routes from './routes';

const APP_ROOT = path.join(__dirname, '../');
const logger = require('./lib/logger')();

const app = express();

// use handlebars as the html engine renderer
app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// serve the static assets (js/css)
app.use(express.static(path.join(APP_ROOT, 'public')));

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

    // this could be a 404 page, but instead, redirect them to the home page
    if (!renderProps) {
      return res.status(404).end();
    }

    // with no errors and no redirects, render the page
    return res.render('index', {
      content: renderToString(<RouterContext {...renderProps} />),
    });
  });
});

module.exports = app;
