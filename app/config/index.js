const config = {
  port: process.env.PORT || 3000,
  webpack: {
    localIdentName: '[name]__[local]', // https://github.com/webpack/loader-utils#interpolatename
  },
};

module.exports = config;
