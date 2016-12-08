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
    { className: 'row' },
    bars.map(function (bar) {
      return _react2.default.createElement(
        'section',
        {
          className: 'card col-lg-4 col-md-6 col-sm-12',
          key: bar.id
        },
        _react2.default.createElement('img', {
          className: 'card-img-top',
          src: bar.img_url,
          alt: bar.name
        }),
        _react2.default.createElement(
          'section',
          { className: 'card-block' },
          _react2.default.createElement(
            'h2',
            { className: 'card-title' },
            bar.name
          ),
          _react2.default.createElement(
            'p',
            { className: 'card-text' },
            '"' + bar.description + '"'
          ),
          _react2.default.createElement(
            'button',
            {
              className: 'btn btn-primary',
              onClick: function onClick() {
                return handleGoingClick(bar.id);
              }
            },
            bar.going.length + ' Going'
          )
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
        setTimeout(this.handleSubmit, 0);
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
                color: '#ddd',
                fontSize: '3em'
              } },
            'Whats going on in your local bars?'
          ),
          _react2.default.createElement(
            'h3',
            { style: { color: '#ddd' } },
            'Enter your local town and tell people where your going tonight!'
          ),
          _react2.default.createElement(
            'form',
            { onSubmit: this.handleSubmit },
            _react2.default.createElement('input', {
              className: 'form-control',
              onChange: this.handleChange,
              value: this.state.cityInput,
              placeholder: 'Please enter your area...',
              style: {
                display: 'block',
                fontSize: '1.5em',
                margin: '20px auto',
                textAlign: 'center',
                width: '100%'
              }
            })
          ),
          !this.state.fetching ? _react2.default.createElement(Bars, { bars: this.state.bars, handleGoingClick: this.handleGoingClick }) : _react2.default.createElement(
            'h2',
            { style: { color: '#ddd' } },
            'Loading...'
          ),
          _react2.default.createElement(
            'section',
            { style: { fontSize: '1.5em' } },
            'Created for ',
            _react2.default.createElement(
              'a',
              { href: 'http://freecodecamp.com' },
              'freecodecamp.com'
            ),
            '. Source @ ',
            _react2.default.createElement(
              'a',
              { href: 'https://github.com/joesmith100/fcc-nightlife-app' },
              'GitHub'
            )
          )
        )
      );
    }
  }]);

  return App;
}(_react2.default.Component);

exports.default = App;