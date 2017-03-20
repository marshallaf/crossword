module.exports = {
  devtool: 'source-map',
  entry: [
    '.app/index.js'
  ],
  output: {
    path: __dirname + '/build',
    filename: 'index_bundle.js',
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.css$/, loader: 'style-loader!css-loader!sass-loader'},
    ],
  },
}