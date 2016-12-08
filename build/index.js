'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactHotLoader = require('react-hot-loader');

require('./assets/stylus/main.styl');

var _App = require('./components/App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactDom2.default.render(_react2.default.createElement(
  _reactHotLoader.AppContainer,
  null,
  _react2.default.createElement(_App2.default, null)
), document.getElementById('root'));

if (module.hot) {
  module.hot.accept('./components/App', function () {
    /* eslint-disable global-require */
    var NewApp = require('./components/App').default;
    /* eslint-disable global-require */

    _reactDom2.default.render(_react2.default.createElement(
      _reactHotLoader.AppContainer,
      null,
      _react2.default.createElement(NewApp, null)
    ), document.getElementById('root'));
  });
}