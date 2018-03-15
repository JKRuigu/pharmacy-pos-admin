const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user-model');
const Admin = require('../models/admin-model');
const LocalStrategy = require('passport-local').Strategy;
const url = 'mongodb://localhost:27017/pharmacy-pos';
const express = require('express');
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const keys = require('../config/keys');
const swal = require('sweetalert2')

function generateHash(password) {
  bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(User.password, salt, function(err, hash) {
        console.log('hash',hash);
	        return hash;
    	});
	});
}

// auth logout
router.get('/auth/logout', (req, res) => {
    req.app.locals.user=null;
    console.log(req.app.locals.user);
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
        req.app.locals.user = user;
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
					if (isMatch){
            res.json({status:"OK"});
            req.app.locals.user = user;
            console.log('user2 is:',req.app.locals.user);
					}else
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

// forgot password
router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          alert ( "Oops, something went wrong!" )
          return res.redirect('/');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: keys.facebook.clientID,
          pass: keys.facebook.clientSecret
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'ruigukjohn@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});


router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          console.log('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          var hash = generateHash(req.body.password);
          console.log(hash);
          User.createUser(user, function(err, user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            console.log("error", "Passwords do not match.");
            return res.redirect('/');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: keys.facebook.clientID,
          pass: keys.facebook.clientSecret
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'ruigukjohn@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    console.log('error',err);
    res.redirect('/');
  });
});



module.exports = router;
