const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user-model');
const Admin = require('../models/admin-model');
const LocalStrategy = require('passport-local').Strategy;

// auth login
router.get('/login', (req, res) => {
    res.render('/', { user: req.user });
});

// auth logout
router.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


// auth with google+
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));


// hand control to passport to use code to grab profile info
router.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
    // res.send(req.user);
    res.redirect('/profile');
});

//FacebookStrategy
router.get('/auth/facebook', passport.authenticate('facebook'
  // {scope: ['email']}
));

//FacebookStrategy-redirect
router.get('/auth/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
    // res.send(req.user);
    res.redirect('/profile');
});

//LocalStrategy-get-login
router.get('/auth/login-local', function(req, res){
  res.render('/', { message: req.flash('loginMessage') });
});

//LocalStrategy-post-login
router.post('/auth/login-local', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/',
 failureFlash: true
}));

//LocalStrategy-register-get
router.get('/auth/register', function(req, res){
  res.render('register'
, { message: req.flash('signupMessage') }
);
});

//LocalStrategy-register-post
router.post('/auth/register', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true
}));



module.exports = router;
