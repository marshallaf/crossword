const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    app: [
      './app/index.js'
    ],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    //publicPath: '/serve/',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader'},
    ],
  },
  devServer: {
    inline: true,
  },
  plugins: [new htmlWebpackPlugin({
    title: 'Crossword Explosion',
    template: './app/index.ejs',
  })],
}