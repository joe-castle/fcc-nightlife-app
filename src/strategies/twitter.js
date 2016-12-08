import passport from 'passport';
import { Strategy } from 'passport-twitter';

import actions from '../data/actions';
import _keys from '../_keys';

const users = actions('users');

passport.use(new Strategy({
    consumerKey: process.env.TWITTER_KEY || _keys.twitterStrategy.consumerKey,
    consumerSecret: process.env.TWITTER_KEY || _keys.twitterStrategy.consumerSecret,
    callbackURL: process.env.NODE_ENV === 'production' 
      ? 'http://fcc-nightlife2-app.herokuapp.com/auth/twitter/callback'
      : 'http://localhost:3001/auth/twitter/callback',
  },
  (token, tokenSecret, profile, done) => {
    users.get(profile.id)
      .then(user => {
        if (!user) {
          users.set(profile.id, { id: profile.id, lastSearch: '' })
        }

        done(null, user || { id: profile.id, lastSearch: '' });
      });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  users.get(id)
    .then(user => done(null, user));
});

export default passport;