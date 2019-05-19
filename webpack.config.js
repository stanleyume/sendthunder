const path = require('path');

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'public')
  },
  watch: true,
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, 'public')
  },
  module: {
    rules: [
      { test: /(\.js|\.jsx)$/, use: 'babel-loader'},
      { test: /\.css/, use: ['style-loader', 'css-loader'] }
    ]
  }
}