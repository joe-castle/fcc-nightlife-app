'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _connectRedis = require('connect-redis');

var _connectRedis2 = _interopRequireDefault(_connectRedis);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _yelp = require('yelp');

var _yelp2 = _interopRequireDefault(_yelp);

var _serverRender = require('../server-render');

var _serverRender2 = _interopRequireDefault(_serverRender);

var _twitter = require('../strategies/twitter');

var _twitter2 = _interopRequireDefault(_twitter);

var _client = require('../data/client');

var _client2 = _interopRequireDefault(_client);

var _actions = require('../data/actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var RedisStore = (0, _connectRedis2.default)(_expressSession2.default);
var app = (0, _express2.default)();
var bars = (0, _actions2.default)('bars');
var users = (0, _actions2.default)('users');

function makeLocalBarsObject(bar) {
  var going = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  return {
    id: bar.id,
    name: bar.name,
    description: bar.snippet_text,
    img_url: bar.image_url,
    going: going
  };
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() || process.env.NODE_ENV === 'test') {
    return next();
  } else {
    res.redirect('/auth/twitter');
  }
}

function resetDatabaseEveryDay() {
  var now = new Date().getHours();
  var msUntilTomorrow = (24 - now) * 60 * 60 * 1000;

  setTimeout(function () {
    bars.delAll();

    resetDatabaseEveryDay();
  }, msUntilTomorrow);
}

resetDatabaseEveryDay();

var _keys = void 0;
try {
  _keys = require('../_keys');
} catch (e) {
  _keys = { yelp: {} };
}

app.use('/assets', _express2.default.static(__dirname + '/../assets'));
app.use((0, _cookieParser2.default)());
app.use((0, _expressSession2.default)({
  store: new RedisStore({ client: _client2.default }),
  secret: 'NEEDS TO BE CHANGED',
  resave: false,
  saveUninitialized: false
}));
app.use(_twitter2.default.initialize());
app.use(_twitter2.default.session());

app.get('/api/bars', function (req, res) {
  var yelp = new _yelp2.default({
    consumer_key: process.env.YELP_KEY || _keys.yelp.consumer_key,
    consumer_secret: process.env.YELP_KEY_SECRET || _keys.yelp.consumer_secret,
    token: process.env.YELP_TOKEN || _keys.yelp.token,
    token_secret: process.env.YELP_TOKEN_SECRET || _keys.yelp.token_secret
  });

  yelp.search({ term: 'bars', location: req.query.city }).then(function (data) {
    bars.getAll().then(function (bars) {
      if (!bars) {
        return res.json(data.businesses.map(function (bar) {
          return makeLocalBarsObject(bar);
        }));
      }

      res.json(data.businesses.map(function (bar) {
        return makeLocalBarsObject(bar, bars[bar.id] && JSON.parse(bars[bar.id]));
      }));
    });
  }).catch(function (error) {
    res.status(error.statusCode).send(error.data);
  });

  if (req.isAuthenticated()) {
    users.set(req.user.id, Object.assign(req.user, { lastSearch: req.query.city }));
  }
});

app.put('/api/bars', ensureAuthenticated, function (req, res) {
  bars.get(req.query.bar).then(function (bar) {
    var newBar = void 0;

    if (bar) {
      newBar = !bar.includes(req.user.id) ? [].concat(_toConsumableArray(bar.slice(0)), [req.user.id]) : bar.filter(function (user) {
        return user !== req.user.id;
      });
    } else {
      newBar = [req.user.id];
    }

    bars.set(req.query.bar, newBar);

    res.json(newBar);
  });
});

app.get('/auth/twitter', function (req, res, next) {
  console.log(process.env.TWITTER_KEY, process.env.TWITTER_SECRET);
  next();
}, _twitter2.default.authenticate('twitter'));
app.get('/auth/twitter/callback', _twitter2.default.authenticate('twitter', {
  successRedirect: '/',
  failureRedirect: '/'
}));

app.get('*', function (req, res) {
  if (req.isAuthenticated()) {
    return (0, _serverRender2.default)(req, res, { authenticated: true, lastSearch: req.user.lastSearch });
  }

  (0, _serverRender2.default)(req, res, { authenticated: false, lastSearch: '' });
});

exports.default = app;