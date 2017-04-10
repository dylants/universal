import App from '../containers/app/app.container';
import Home from '../containers/home/home.container';
import Page1 from '../containers/page1/page1.container';
import Page2 from '../containers/page2/page2.container';

export const routes = [
  {
    component: App,
    routes: [
      {
        path: '/',
        exact: true,
        component: Home,
      },
      {
        path: '/page1',
        exact: true,
        component: Page1,
      },
      {
        path: '/page2',
        exact: true,
        component: Page2,
      },
    ],
  },
];
