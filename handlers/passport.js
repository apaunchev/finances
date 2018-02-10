const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

const User = mongoose.model('User');
const Category = mongoose.model('Category');

async function createInitialUserData(user) {
  const category = await new Category({
    name: 'Unsorted',
    color: '#7f8c8d',
    user: user._id,
  }).save();
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await new User({
        googleId: profile.id,
        email: profile.emails && profile.emails.filter(email => email.type === 'account')[0].value,
      }).save();

      createInitialUserData(user);

      done(null, user);
    }
  )
);
