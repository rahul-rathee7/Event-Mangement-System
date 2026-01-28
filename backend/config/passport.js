import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.js'; // Adjust the path to your user model if necessary

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: '/api/auth/google/callback',
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find a user with the Google ID
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // If user exists, return the user
        return done(null, user);
      } else {
        // If user doesn't exist, check for email and create a new user
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // If a user with that email exists, link the Google account
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        } else {
          // Create a new user
          const newUser = new User({
            googleId: profile.id,
            fullname: profile.displayName,
            email: profile.emails[0].value,
            // You might want to set a default role or other properties
            role: 'user', 
          });

          await newUser.save();
          return done(null, newUser);
        }
      }
    } catch (error) {
      return done(error, false);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});
