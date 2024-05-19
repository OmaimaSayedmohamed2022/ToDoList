const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy(
  {
    clientID: process.env.client_id,
    clientSecret: process.env.client_secret,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    scope: ['profile', 'email'],
  },
  function(accessToken, refreshToken, profile, cb) {
    userProfile=profile;
    return cb(null, userProfile);
}
));



const googleSignIn = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const googleId = req.user.id;
    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({
        googleId,
        email: req.user.emails[0].value,
        userName: req.user.displayName,
        provider: 'google',
      });

      await user.save();
    }
    const token = jwt.sign({ userId: user._id, provider: 'google' }, process.env.KEY_TOKEN);

    if (user.token.length >= process.env.COUNT_TOKEN) {
      return res.status(500).json({ status: 0, message: `You do not have the authority to own more than ${process.env.COUNT_TOKEN} devices` });
    }

    user.token.push(token);
    await user.save();

    // Check if profile.displayName exists before using it
    user.userName = req.user.displayName || 'DefaultUserName';
    await user.save();

    return res.status(201).json({ status: 1, success: 'Logged Successfully', token, provider: 'google' });
  }  catch (error) {
    if (error.name === 'ValidationError') {
        console.error('Validation Errors:', error.errors);
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ status: 0, message: 'User validation failed', errors: validationErrors });
    }
    return res.status(500).json({ status: 0, message: 'Internal Server Error', error: error.message });
  }
};


const  googleLogout = async (req, res) => {

const { _id } = req.body;

try { 
 await User.findByIdAndDelete(_id)


    return res.status(200).json({ message: 'logout Successfully' })
} catch (err) {
    res.status(400).send({ message: 'Failed to sign out fb user' })
}
}

module.exports = {
  googleSignIn,
  googleLogout,

};








// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// passport.use(new GoogleStrategy({
//     clientID: process.env.client_id,
//     clientSecret: process.env.client_secret,
//     callbackURL: "http://localhost:3000/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//       userProfile=profile;
//       return done(null, userProfile);
//   }
// ));
 
// app.get('/auth/google', 
//   passport.authenticate('google', { scope : ['profile', 'email'] }));
 
// app.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/error' }),
//   function(req, res) {

//     res.redirect('/success');
//   });


