const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user-model');
const Admin = require('../models/admin-model');
const LocalStrategy = require('passport-local').Strategy;
const url = 'mongodb://jkruigu:pharmacy-pos@ds237858.mlab.com:37858/pharmacy-pos';
const express = require('express');

// const photoUpload = require('./routes/photo-upload');


// auth logout
router.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});
//
//
// // auth with google+
// router.get('/auth/google', passport.authenticate('google', {
//     scope: ['profile', 'email']
// }));
//
//
// // hand control to passport to use code to grab profile info
// router.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
//     // res.send(req.user);
//     req.flash('success','successful login')
//     res.redirect('/users/profile');
// });
//
// //FacebookStrategy
// router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));
//
// //facebook Connnect
// router.get('/connect/facebook', passport.authorize('facebook', { scope: 'email' }));
//
// //FacebookStrategy-redirect
// router.get('/auth/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
//     // res.send(req.user);
//     res.redirect('/profile');
// });
//
// // //LocalStrategy-get-login
// // router.get('/auth/login-local', function(req, res){
// //   req.flash('success','successful login')
// //   res.render('/');
// // });
//
// //LocalStrategy-post-login
// router.post('/auth/login-local', passport.authenticate('local-login', {
//   successRedirect: '/profile',
//   failureRedirect: '/',
//   failureFlash: true
// }));
//

// // connect google
// router.get('/connect/google', passport.authorize('google',{
//   scope: ['profile', 'email']
// }));

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


//Register POST
router.post('/profile/register',function (req,res) {
	var tel = req.body.tel;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	if (!tel || !email || !password || !password2) {
    swal({
      title: "Error!",
      text: "Try to fil all the spaces !",
      icon: "info",
    });
	} else {
		var newUser = new User({
			tel :tel,
			email :email,
			password :password
		});

	 	User.createUser(newUser,function (err,user) {
	 		if (err) throw err;
	 	});
    console.log(newUser);
	 	res.redirect('/users/profile');
	}
});


module.exports = router;
