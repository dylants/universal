import config from '../app/config';

// this is required to get babel to process css-modules
const hook = require('css-modules-require-hook');
const sass = require('node-sass');

hook({
  extensions: ['.scss', '.css'],
  generateScopedName: config.webpack.localIdentName,
  preprocessCss: (data, file) => sass.renderSync({ file }).css,
});
