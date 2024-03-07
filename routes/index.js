var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get('/auth/google', passport.authenticate(
  // Which passport strategy is being used?
  'google',
  {
    // Requesting the user's profile and email
    scope: ['profile', 'email'],
    // Optionally force pick account every time
    // prompt: "select_account"
  }
));

// Google OAuth callback route
router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/user',
    failureRedirect: '/'
  }
));

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/user',
  failureRedirect: '/',
  failureFlash: true // Enable flash messages for error handling
}));

// Add an error handler middleware
router.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(`Something broke! Error: ${err.message}`);
});
// OAuth logout route
router.get('/logout', function(req, res){
  req.logout(function() {
    res.redirect('/');
  });
});

router.get('/', function(req, res, next) {
  res.render('index');
});



module.exports = router;