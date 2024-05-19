
const googleController = require('../controllers/googleController')
// const verifyToken = require('../config/verifyToken')
const express = require('express')
const router = express.Router()
const passport = require('passport')

// log in gmail
router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/callback', passport.authenticate('google', { failureRedirect: '/auth/google/error' }), googleController.googleSignIn);
router.get('/success', googleController.googleSignIn);
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/error' }), function(req, res) { res.redirect('/success');});
router.get('/error', (req, res) => res.status(500).json({ status: 0, error: 'Error logging in via Google.' }));

router.delete('/logout', googleController.googleLogout)

module.exports = router