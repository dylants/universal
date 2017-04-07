// We need to 'use strict' here because this file isn't compiled with babel
'use strict'; // eslint-disable-line strict, lines-around-directive

const path = require('path');
const webpack = require('webpack');
const config = require('./app/config');

const appPath = path.join(__dirname, 'app');
const assetsPath = path.join(__dirname, 'public');
const publicPath = '/';

function getPlugins() {
  return [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),

    // https://webpack.js.org/guides/code-splitting-libraries/#implicit-common-vendor-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => module.context && module.context.indexOf('node_modules') !== -1,
    }),

    // https://github.com/glenjamin/webpack-hot-middleware
    new webpack.HotModuleReplacementPlugin(),
  ];
}

function getLoaders() {
  // https://github.com/webpack/style-loader
  const styleLoaderConfig = { loader: 'style-loader' };
  // https://github.com/webpack/css-loader
  const cssLoaderConfig = { loader: 'css-loader',
    options: {
      sourceMap: true,
      modules: true,
      importLoaders: 1,
      localIdentName: config.webpack.localIdentName,
      minimize: true,
    },
  };
  // https://github.com/jtangelder/sass-loader
  const sassLoaderConfig = { loader: 'sass-loader',
    options: {
      sourceMap: true,
    },
  };
  const sassLoaders = [styleLoaderConfig, cssLoaderConfig, sassLoaderConfig];

  return [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          // Don't use .babelrc. Use the specified config below with webpack
          babelrc: false,
          // This disables babel's transformation of ES2015 module syntax.
          // Doing so allows us to use Webpack 2's import system instead.
          // https://webpack.js.org/guides/migrating/
          presets: [['env', { modules: false }], 'stage-2', 'react'],
          plugins: ['transform-strict-mode', 'react-hot-loader/babel'],
        },
      },
    }, {
      test: /(\.scss)$/,
      exclude: /node_modules/,
      use: sassLoaders,
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'eslint-loader',
    },
  ];
}

function getEntry() {
  const entry = [];

  // https://babeljs.io/docs/usage/polyfill/
  // babel polyfill to support older browsers
  entry.push('babel-polyfill');

  // https://github.com/gaearon/react-hot-loader/tree/master/docs#migration-to-30
  entry.push('react-hot-loader/patch');

  // https://github.com/glenjamin/webpack-hot-middleware
  entry.push('webpack-hot-middleware/client?reload=true');

  // our client application
  entry.push(path.join(appPath, 'config/client.js'));

  return entry;
}

function getOutput() {
  return {
    path: assetsPath,
    publicPath,
    filename: '[name].js',
  };
}

module.exports = {
  cache: true,

  target: 'web',

  devtool: 'eval-source-map',

  resolve: {
    modules: [
      appPath,
      'node_modules',
    ],
  },

  plugins: getPlugins(),

  module: {
    rules: getLoaders(),
  },

  entry: getEntry(),

  output: getOutput(),
};
