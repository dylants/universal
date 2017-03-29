const config = {
  port: process.env.PORT || 3000,
  webpack: {
    localIdentName: '[local]___[hash:base64:5]',
  },
};

module.exports = config;
