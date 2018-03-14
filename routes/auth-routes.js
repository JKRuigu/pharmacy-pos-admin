const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user-model');
const Admin = require('../models/admin-model');
const LocalStrategy = require('passport-local').Strategy;
const url = 'mongodb://localhost:27017/pharmacy-pos';
const express = require('express');

// const photoUpload = require('./routes/photo-upload');

router.get('/updates', (req, res)=>{

});

router.post('/updates', (req, res)=>{

});

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

router.post('/profile/login', (req, res) =>{
	if(req.body){
		User.findOne({email:req.body.email}).then(user=>{
			if (!user){
        res.status(404).json({message:"User doesn't exist...!!!"});
			} else {
        User.comparePassword(req.body.password, user.password, function (hash, isMatch) {
					if (isMatch)
            res.json({status:"OK"});
					else
            res.status(404).json({message:"Email/Password is incorrect...!!!"});
        })
      }
		}).catch(error=>{
      res.status(404).json({message:error.message});
		});
	} else {
		res.status(404).json({message:"Information invalid"})
	}
});


module.exports = router;
