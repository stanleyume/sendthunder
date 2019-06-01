const path = require('path');

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  watch: true,
  // mode: 'production',
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/public',
    filename: 'main.js'
  },
  module: {
    rules: [
      { test: /(\.js|\.jsx)$/, use: 'babel-loader'},
      { test: /\.css/, use: ['style-loader', 'css-loader'] }
    ]
  }
}