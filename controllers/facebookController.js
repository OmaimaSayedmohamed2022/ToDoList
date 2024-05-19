const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
    const userProfile = profile;
    return cb(null, userProfile);
  }
));

const facebookSignIn = async (req, res) => {
    try {
      const facebookId = req.user.id;
      let user = await User.findOne({ facebookId });
  
      if (!user) {
        // Check if emails exist and has at least one element
        const email = req.user.emails && req.user.emails.length > 0 ? req.user.emails[0].value : null;
  
        user = new User({
          facebookId,
          email: email,
          userName: req.user.displayName,
          provider: 'facebook',
        });
  
        await user.save();
      }

    const token = jwt.sign({ userId: user._id, provider: 'facebook' }, process.env.KEY_TOKEN);

    if (user.token.length >= process.env.COUNT_TOKEN) {
      return res.status(500).json({message: `You do not have the authority to own more than ${process.env.COUNT_TOKEN} devices` });
    }

    user.token.push(token);
    await user.save();

    user.userName = req.user.displayName || 'DefaultUserName';
    await user.save();

    return res.status(201).json({ status: 1, success: 'Logged Successfully', token, provider: 'facebook' });
  }  catch (error) {
    if (error.name === 'ValidationError') {
      console.error('Validation Errors:', error.errors);
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ status: 0, message: 'User validation failed', errors: validationErrors });
    }
    return res.status(500).json({ status: 0, message: 'Internal Server Error', error: error.message });
  }
};

const facebookLogout = async (req, res) => {
  const { _id } = req.body;
  try {
    await User.findByIdAndDelete(_id);
    return res.status(200).json({ status: 1, success: 'Logout Successfully' });
  } catch (err) {
    return res.status(400).json({ message: 'Failed to sign out facebook user' });
  }
};

module.exports = {
  facebookSignIn,
  facebookLogout,
};
