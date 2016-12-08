'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportTwitter = require('passport-twitter');

var _actions = require('../data/actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var users = (0, _actions2.default)('users');

var _keys = void 0;
try {
  _keys = require('../_keys');
} catch (e) {
  _keys = { twitterStrategy: {} };
}

_passport2.default.use(new _passportTwitter.Strategy({
  consumerKey: process.env.TWITTER_KEY || _keys.twitterStrategy.consumerKey,
  consumerSecret: process.env.TWITTER_KEY || _keys.twitterStrategy.consumerSecret,
  callbackURL: process.env.NODE_ENV === 'production' ? 'http://fcc-nightlife2-app.herokuapp.com/auth/twitter/callback' : 'http://localhost:3001/auth/twitter/callback'
}, function (token, tokenSecret, profile, done) {
  users.get(profile.id).then(function (user) {
    if (!user) {
      users.set(profile.id, { id: profile.id, lastSearch: '' });
    }

    done(null, user || { id: profile.id, lastSearch: '' });
  });
}));

_passport2.default.serializeUser(function (user, done) {
  done(null, user.id);
});

_passport2.default.deserializeUser(function (id, done) {
  users.get(id).then(function (user) {
    return done(null, user);
  });
});

exports.default = _passport2.default;