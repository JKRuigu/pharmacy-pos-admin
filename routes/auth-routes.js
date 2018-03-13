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
      if (err){
        res.status(404).json({message: "Email already taken."});
    	}else {
        res.user = user;
        res.writeHead(302, {
          'Location': '/profile'
        });
        res.end();
      }
	 	});
	}
});


module.exports = router;
