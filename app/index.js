const React = require('react');
const ReactDOM = require('react-dom');
import App from './App';
require('file-loader?name=[name].[ext]!../crosswords/testcrossword.xml');

ReactDOM.render(
  <App></App>,
  document.getElementById('app')
);