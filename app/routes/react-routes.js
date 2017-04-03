import React from 'react';
import { Route, Router } from 'react-router';

import App from '../containers/app/app.container';
import Home from '../containers/home/home.container';
import Page1 from '../containers/page1/page1.container';
import Page2 from '../containers/page2/page2.container';

export function createRoutes(history) {
  return (
    <Router history={history}>
      <Route component={App}>
        <Route path="/" component={Home} />
        <Route path="/page1" component={Page1} />
        <Route path="/page2" component={Page2} />
      </Route>
    </Router>
  );
}
