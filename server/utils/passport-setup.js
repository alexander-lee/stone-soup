import bcrypt from 'bcryptjs';
import passport from 'passport';
import _ from 'lodash';

import { Restaurant } from '../models';
import auth from '../config/auth';

const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await Restaurant.findById(id);
    done(null, user);
  }
  catch(err) {
    done(err);
  }
});

/*
passport.use(new GoogleStrategy(auth.google,
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(async function() {
      try {
        let user = await Restaurant.findOne({ where: { googleId: profile.id } });

        const fields = {
          email: _.get(profile, 'emails[0].value'),
          firstName: _.get(profile, 'name.givenName'),
          lastName: _.get(profile, 'name.familyName'),
        }

        if(!user) {
          user = await Restaurant.create({
            googleId: profile.id,
            ...fields
          });
        }

        await user.update({
          token: accessToken,
          refreshToken: refreshToken,
          ...fields
        });

        return done(null, user);
      }
      catch(err) {
        return done(err);
      }
    });
}));
*/

passport.use('local', new LocalStrategy(
  async function(username, password, done) {
    try {
      const user = await Restaurant.findOne({username: username});
      // Restaurant doesn't exist
      if(!user) {
        return done(null, false, {message: 'No Restaurant User Found!'});
      }

      // User password doesn't match
      if(!bcrypt.compareSync(password, user.password)) {
        return done(null, false, {message: 'Password does not match!'});
      }

      // All checks passed, return the user
      return done(null, user);
    }
    catch(err) {
      return done(err);
    }
  }
));
