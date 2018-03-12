const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user-model');
const Admin = require('../models/admin-model');
const LocalStrategy = require('passport-local').Strategy;

// const photoUpload = require('./routes/photo-upload');

// auth login
router.get('/login', (req, res) => {
    res.render('/', { user: req.user });
});

// auth logout
router.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});
// google Analytics
router.get('/auth/HelloAnalytics', (req, res) => {
    res.render('HelloAnalytics');
});


// auth with google+
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));


// hand control to passport to use code to grab profile info
router.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
    // res.send(req.user);
    req.flash('success','successful login')
    res.redirect('/profile');
});

//FacebookStrategy
router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

//facebook Connnect
router.get('/connect/facebook', passport.authorize('facebook', { scope: 'email' }));

//FacebookStrategy-redirect
router.get('/auth/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
    // res.send(req.user);
    res.redirect('/profile');
});

// //LocalStrategy-get-login
// router.get('/auth/login-local', function(req, res){
//   req.flash('success','successful login')
//   res.render('/');
// });

//LocalStrategy-post-login
router.post('/auth/login-local', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/',
  failureFlash: true
}));


// connect google
router.get('/connect/google', passport.authorize('google',{
  scope: ['profile', 'email']
}));

// //LocalStrategy-register-get
// router.get('/auth/register', function(req, res){
//   res.render('/auth/register',{message:req.flash('signupMessage')});
// });
//
//
// //LocalStrategy-register-post
// router.post('/auth/register', passport.authenticate('local-signup', {
//   successRedirect: '/',
//   failureRedirect: '/',
//   failureFlash:true
// }));



module.exports = router;
