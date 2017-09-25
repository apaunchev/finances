const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './client/src/index.js'
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'client')
  },
  context: __dirname,
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      options: {
        presets: ['react', 'env']
      }
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader'
      ]
    }]
  }
};
