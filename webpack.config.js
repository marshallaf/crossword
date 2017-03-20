const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: {
    app: [
      './app/index.js'
    ],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/assets/',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.css$/, loader: 'style-loader!css-loader!sass-loader'},
    ],
  },
  devServer: {
    inline: true,
  },
}