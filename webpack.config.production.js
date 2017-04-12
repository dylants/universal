// We need to 'use strict' here because this file isn't compiled with babel
'use strict'; // eslint-disable-line strict, lines-around-directive

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const config = require('./app/config');

const appPath = path.join(__dirname, 'app');
const buildPath = path.join(__dirname, 'build');
const assetsPath = path.join(__dirname, 'public');
const publicPath = '/';

function getPlugins() {
  return [
    // https://github.com/lodash/lodash-webpack-plugin
    new LodashModuleReplacementPlugin(),

    // https://github.com/jantimon/html-webpack-plugin
    new HtmlWebpackPlugin({
      // write the file to the build path (for server side rendering)
      filename: path.join(buildPath, 'views', 'index.hbs'),
      inject: 'body',
      template: path.join(appPath, 'views', 'index.hbs'),
    }),

    // https://webpack.js.org/plugins/define-plugin
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),

    // https://webpack.js.org/plugins/uglifyjs-webpack-plugin
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
    }),

    // https://webpack.js.org/plugins/commons-chunk-plugin
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      // https://webpack.js.org/guides/code-splitting-libraries/#implicit-common-vendor-chunk
      minChunks: module => module.context && module.context.indexOf('node_modules') !== -1,
    }),

    // https://webpack.js.org/plugins/commons-chunk-plugin
    new webpack.optimize.CommonsChunkPlugin({
      // https://webpack.js.org/plugins/commons-chunk-plugin/#manifest-file
      name: 'manifest',
      minChunks: Infinity,
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
        options: {
          // Don't use .babelrc. Use the specified config below with webpack
          babelrc: false,
          // { modules: false } disables babel's transformation of ES module syntax.
          // Doing so allows us to use Webpack 2's import system instead.
          // https://webpack.js.org/guides/migrating/
          presets: [['env', { modules: false }], 'stage-2', 'react'],
          plugins: ['transform-strict-mode', 'lodash'],
        },
      },
    }, {
      test: /(\.scss)$/,
      exclude: /node_modules/,
      use: sassLoaders,
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
