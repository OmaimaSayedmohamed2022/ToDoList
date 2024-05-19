const express = require('express');
const router = express.Router();
const facebookController = require('../controllers/facebookController');
const passport = require('passport')

router.get('/', passport.authenticate('facebook', { scope: ['profile', 'email'] }));
router.get('/callback', passport.authenticate('facebook', { failureRedirect: '/auth/facebook/error' }), facebookController.facebookSignIn);
router.get('/success', facebookController.facebookSignIn);
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/error' }), function(req, res) { res.redirect('/success'); });
router.get('/error', (req, res) => res.status(500).json({ status: 0, error: 'Error logging in via Facebook.' }));

router.delete('/logout', facebookController.facebookLogout);

module.exports = router;
