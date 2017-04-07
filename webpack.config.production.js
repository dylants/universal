// We need to 'use strict' here because this file isn't compiled with babel
'use strict'; // eslint-disable-line strict, lines-around-directive

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('./app/config');

const appPath = path.join(__dirname, 'app');
const assetsPath = path.join(__dirname, 'public');
const publicPath = '/';

function getPlugins() {
  return [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),

    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
    }),

    // https://webpack.js.org/guides/code-splitting-libraries/#implicit-common-vendor-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => module.context && module.context.indexOf('node_modules') !== -1,
    }),

    // https://github.com/webpack/extract-text-webpack-plugin
    new ExtractTextPlugin('[name].min.css'),
  ];
}

function getLoaders() {
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
  // https://github.com/webpack/extract-text-webpack-plugin
  const sassLoaders = ExtractTextPlugin.extract({
    use: [cssLoaderConfig, sassLoaderConfig],
  });

  return [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
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

  // our client application
  entry.push(path.join(appPath, 'config/client.js'));

  return entry;
}

function getOutput() {
  return {
    path: assetsPath,
    publicPath,
    filename: '[name].min.js',
  };
}

module.exports = {
  target: 'web',

  devtool: 'source-map',

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
