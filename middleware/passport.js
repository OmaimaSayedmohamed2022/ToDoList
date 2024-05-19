const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook',
    profileFields: ['profile', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
    // Check if the authorization code has expired
    const authorizationExpiresIn = profile._json.expires_in;
    const expirationTime = Date.now() + (authorizationExpiresIn * 1000); 
    const currentTime = Date.now();

    if (expirationTime < currentTime) {
      return cb(new Error('Authorization code has expired'), null);
    }
    return cb(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
 
module.exports = passport;