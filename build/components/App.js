'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function Bars(_ref) {
  var bars = _ref.bars,
      handleGoingClick = _ref.handleGoingClick;

  return _react2.default.createElement(
    'section',
    null,
    bars.map(function (bar) {
      return _react2.default.createElement(
        'section',
        { key: bar.id },
        _react2.default.createElement('img', { src: bar.img_url, alt: bar.name }),
        _react2.default.createElement(
          'h4',
          null,
          bar.name
        ),
        _react2.default.createElement(
          'p',
          null,
          bar.description
        ),
        _react2.default.createElement(
          'button',
          { onClick: function onClick() {
              return handleGoingClick(bar.id);
            } },
          bar.going.length + ' Going'
        )
      );
    })
  );
}

// Class used as hot-reloader does not work with pure function components
// as the entry point.

var App = exports.App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

    _this.handleSubmit = function (ev) {
      ev.preventDefault();

      _axios2.default.get('/api/bars?city=' + _this.cityInput.value).then(function (bars) {
        _this.setState({ bars: bars.data });
      }).catch(function (error) {
        return console.log('error', error);
      });
    };

    _this.handleGoingClick = function (id) {
      if (_this.state.authenticated) {
        _axios2.default.put('/api/bars?id=' + id).then(console.log).catch(console.log);
      } else {
        _axios2.default.get('/auth/twitter').then(console.log).catch(console.log);
      }
    };

    _this.state = {
      authenticated: false,
      bars: []
    };
    return _this;
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setState(window.__INITIAL_STATE__);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'App' },
        _react2.default.createElement(
          'main',
          { style: {
              margin: '0 auto',
              maxWidth: '800px'
            } },
          _react2.default.createElement(
            'h1',
            { style: {
                fontSize: '3em',
                textAlign: 'center'
              } },
            'Whats going on in your local bars?'
          ),
          _react2.default.createElement(
            'form',
            { onSubmit: this.handleSubmit },
            _react2.default.createElement('input', {
              ref: function ref(c) {
                _this2.cityInput = c;
              },
              placeholder: 'Please enter your area...',
              style: {
                display: 'block',
                margin: '0 auto',
                width: '30em'
              }
            })
          ),
          _react2.default.createElement(Bars, { bars: this.state.bars, handleGoingClick: this.handleGoingClick })
        )
      );
    }
  }]);

  return App;
}(_react2.default.Component);

exports.default = App;