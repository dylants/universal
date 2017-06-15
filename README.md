# universal #

An example universal/isomorphic web application.

## Overview ##

This application is meant to illustrate both client side and server side rendering. The following technologies are included:

- React
- React Router 4
- Redux
- CSS modules (using Sass)
- Express
- Webpack 2
- Babel
- ESLint

The `app` directory contains both the Express configuration and routes, along with React components that are rendered via Express and through the client (browser). Webpack configuration exists for both the `development` and `production` environments. Babel compiles down the source code for both the client and server.

## Technical Details ##

The server side begins within `app/config/server.js`, which is responsible for loading the application. The Express configuration is contained within `app/config/express.js`. This configuration uses Webpack middleware to run Webpack in `development` mode, and expects Webpack bundles to be available and served in `production` mode. The Express configuration also loads the `app/routes/express-routes.js`, which contains APIs and a single render controller responsible for properly rendering (and loading initial data for) React components.

A shared `app/routes/react-routes.js` contains the web UI routes. This uses React Router to build a simple set of routes. Redux is linked within this React configuration, and some example actions and dispatches are contained within the code base.

An example container (`app/containers/page1/page1.container.js`) requires some data loaded on construction. When a request is sent to the server to render this container, the server will load the data and use it when rendering the view. The server will also package the Redux store for the client to load as its initial state. When the client renders this view, the Redux action notices the data already exists in state, and skips the load.

CSS modules are used within the React components/containers. Since both the server and the client must generate the same `localIdentName` used within CSS modules, a deterministic pattern is used. This includes the `[name]` and `[local]` keys (but not the `[hash]` since it uses the path which changes based on client/server environments because of the build). This should be unique within the scope of the application as long as the names of components and containers are unique.

Additional information can be found here:<br />
https://blog.dylants.com/posts/20170415/universal-isomorphic-web-app

## Getting Started ##

Install Node (I recommend [nvm](https://github.com/creationix/nvm)), clone the repository, and install the dependencies:

```
$ yarn   // or `npm install` if you'd rather
```

To start the application (in `development`) mode, run the following command:

```
$ npm start
```

For production, run the following commands:

```
$ npm run build

...

$ npm run production
```

Look through the `scripts` within the `package.json` to see additional commands available.
