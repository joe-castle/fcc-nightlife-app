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
    { style: {
        marginTop: '20px'
      } },
    bars.map(function (bar) {
      return _react2.default.createElement(
        'section',
        {
          key: bar.id,
          style: {
            background: '#a2a5d5',
            border: '3px solid #3a4bb8',
            marginBottom: '10px',
            padding: '10px',
            textAlign: 'center'
          }
        },
        _react2.default.createElement('img', {
          style: {
            border: '3px solid #3a4bb8',
            borderRadius: '50%',
            padding: '3px'
          },
          src: bar.img_url,
          alt: bar.name
        }),
        _react2.default.createElement(
          'h2',
          null,
          bar.name
        ),
        _react2.default.createElement(
          'button',
          {
            onClick: function onClick() {
              return handleGoingClick(bar.id);
            },
            style: {
              border: '1px solid #3a4bb8',
              padding: '10px'
            }
          },
          bar.going.length + ' Going'
        ),
        _react2.default.createElement(
          'p',
          { style: { fontStyle: 'italic' } },
          '"' + bar.description + '"'
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
      ev && ev.preventDefault();

      _this.setState({ fetching: true });

      _axios2.default.get('/api/bars?city=' + _this.state.cityInput).then(function (_ref2) {
        var data = _ref2.data;
        _this.setState({ bars: data, fetching: false });
      }).catch(function (error) {
        console.log('error', error);
        _this.setState({ fetching: false });
      });
    };

    _this.handleChange = function (ev) {
      _this.setState({ cityInput: ev.target.value });
    };

    _this.handleGoingClick = function (id) {
      if (_this.state.authenticated) {
        _axios2.default.put('/api/bars?bar=' + id).then(function (_ref3) {
          var data = _ref3.data;

          var newBars = _this.state.bars.slice(0);
          var index = newBars.findIndex(function (bar) {
            return bar.id === id;
          });

          newBars[index].going = data;

          _this.setState({ bars: newBars });
        }).catch(console.log);
      } else {
        // Only way I could get over CORS issue, sending a get request would fail.
        window.open('/auth/twitter', '_self');
      }
    };

    _this.state = {
      bars: [],
      lastSearch: '',
      cityInput: '',
      fetching: false
    };
    return _this;
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _window$__INITIAL_STA = window.__INITIAL_STATE__,
          lastSearch = _window$__INITIAL_STA.lastSearch,
          authenticated = _window$__INITIAL_STA.authenticated;


      this.setState({
        authenticated: authenticated,
        lastSearch: lastSearch,
        cityInput: lastSearch
      });

      if (authenticated) {
        // Settimeout to ensure handleSubmit has correct cityInput as setState is async.
        setTimeout(function () {
          return _this2.handleSubmit();
        }, 0);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'App' },
        _react2.default.createElement(
          'main',
          { style: {
              margin: '0 auto',
              maxWidth: '800px',
              padding: '10px',
              textAlign: 'center'
            } },
          _react2.default.createElement(
            'h1',
            { style: {
                fontSize: '3em'
              } },
            'Whats going on in your local bars?'
          ),
          _react2.default.createElement(
            'h3',
            null,
            'Enter your local town and tell people where your going tonight!'
          ),
          _react2.default.createElement(
            'form',
            { onSubmit: this.handleSubmit },
            _react2.default.createElement('input', {
              onChange: this.handleChange,
              value: this.state.cityInput,
              placeholder: 'Please enter your area...',
              style: {
                display: 'block',
                fontSize: '1.5em',
                margin: '0 auto',
                textAlign: 'center',
                width: '100%'
              }
            })
          ),
          !this.state.fetching ? _react2.default.createElement(Bars, { bars: this.state.bars, handleGoingClick: this.handleGoingClick }) : _react2.default.createElement(
            'h2',
            null,
            'Loading...'
          )
        )
      );
    }
  }]);

  return App;
}(_react2.default.Component);

exports.default = App;