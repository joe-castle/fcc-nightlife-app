import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import Yelp from 'yelp';

import render from '../server-render';
import passport from '../strategies/twitter';
import client from '../data/client';
import actions from '../data/actions';

const RedisStore = connectRedis(session);
const app = express();
const bars = actions('bars');
const users = actions('users');

function makeLocalBarsObject(bar, going = []) {
  return({
    id: bar.id,
    name: bar.name,
    description: bar.snippet_text,
    img_url: bar.image_url,
    going,
  });
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() || process.env.NODE_ENV === 'test') {
    return next();
  } else {
    res.redirect('/auth/twitter');
  }
}

function resetDatabaseEveryDay() {
  const now = new Date().getHours();
  const msUntilTomorrow = (24 - now) * 60 * 60 * 1000

  setTimeout(() => {
    bars.delAll();

    resetDatabaseEveryDay();
  }, msUntilTomorrow)
}

resetDatabaseEveryDay();

let _keys;
try {
  _keys = require('../_keys');
} catch (e) {
  _keys = { yelp: {} };
}

app.use('/assets', express.static(`${__dirname}/../assets`));
app.use(cookieParser());
app.use(session({
  store: new RedisStore({ client }),
  secret: 'NEEDS TO BE CHANGED',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/bars', (req, res) => {
  const yelp = new Yelp({
    consumer_key: process.env.YELP_KEY || _keys.yelp.consumer_key,
    consumer_secret: process.env.YELP_KEY_SECRET || _keys.yelp.consumer_secret,
    token: process.env.YELP_TOKEN || _keys.yelp.token,
    token_secret: process.env.YELP_TOKEN_SECRET || _keys.yelp.token_secret
  });

  yelp.search({ term: 'bars', location: req.query.city })
    .then(data => {
      bars.getAll()
        .then(bars => {
          if (!bars) {
            return res.json(data.businesses.map(bar => makeLocalBarsObject(bar)));
          }

          res.json(data.businesses.map(bar => (
            makeLocalBarsObject(bar, bars[bar.id] && JSON.parse(bars[bar.id]))
          )));
        });
    })
    .catch(error => {
      res.status(error.statusCode).send(error.data);
    })
  
  if (req.isAuthenticated()) {
    users.set(req.user.id, Object.assign(req.user, { lastSearch: req.query.city }));
  }
});

app.put('/api/bars', ensureAuthenticated, (req, res) => {
  bars.get(req.query.bar)
    .then(bar => {
      let newBar;
      
      if (bar) {
        newBar = !bar.includes(req.user.id)
        ? [...bar.slice(0), req.user.id]
        : bar.filter(user => user !== req.user.id);
      } else {
        newBar = [req.user.id];
      }

      bars.set(req.query.bar, newBar);

      res.json(newBar);
    })
});

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/',
  failureRedirect: '/',
}));

app.get('*', (req, res) => { 
  if (req.isAuthenticated()) {
    return render(req, res, { authenticated: true, lastSearch: req.user.lastSearch });
  }

  render(req, res, { authenticated: false, lastSearch: '' });
});

export default app;
