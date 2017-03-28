import React from 'react';
import { Route } from 'react-router';

import App from './containers/app/app.container';
import Home from './containers/home/home.container';
import Page1 from './containers/page1/page1.container';
import Page2 from './containers/page2/page2.container';

export default (
  <Route component={App}>
    <Route path="/" component={Home} />
    <Route path="/page1" component={Page1} />
    <Route path="/page2" component={Page2} />
  </Route>
);
