const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy(
    // Configuration object
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK
    },
    // The verify callback function

    async function(accessToken, refreshToken, profile, cb) {
      
        try {
            // A user has logged in with OAuth...
            let user = await User.findOne({ googleId: profile.id });
            // Existing user found, so provide it to passport
            if (user) return cb(null, user);
            // We have a new user via OAuth!
            user = await User.create({
              name: profile.displayName,
              googleId: profile.id,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value
            });
            return cb(null, user);
          } catch (err) {
            return cb(err);
          }
    },

  ));

  passport.use(new FacebookStrategy(
    {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'emails', 'photos'] // Define the profile fields you want to retrieve
    },
    async function(accessToken, refreshToken, profile, cb) {
        try {
            // A user has logged in with OAuth...
            let user = await User.findOne({ facebookId: profile.id });
            // Existing user found, so provide it to passport
            if (user) return cb(null, user);
            // We have a new user via OAuth!
            user = await User.create({
                name: profile.displayName,
                facebookId: profile.id,
                email: profile.emails ? profile.emails[0].value : '', // Handle cases where email may not be available
                avatar: profile.photos ? profile.photos[0].value : '' // Handle cases where avatar may not be available
            });
            return cb(null, user);
        } catch (err) {
            return cb(err);
        }
    }
));

  passport.serializeUser(function(user, cb) {
    cb(null, user._id);
  });

  passport.deserializeUser(async function(userId, cb) {
    // It's nice to be able to use await in-line!
    cb(null, await User.findById(userId));
  });