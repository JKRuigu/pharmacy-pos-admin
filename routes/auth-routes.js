const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user-model');
// const Admin = require('../models/admin-model');
const LocalStrategy = require('passport-local').Strategy;
// const url = 'mongodb://jkruigu:pharmacy-pos@ds237858.mlab.com:37858/pharmacy-pos';
const express = require('express');
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const keys = require('../config/keys');
const swal = require('sweetalert2')
const randomstring = require('randomstring');

function generateHash(password) {
  bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(User.password, salt, function(err, hash) {
	        return hash;
    	});
	});
}
//error
router.get('/profile/expired',(req,res)=>{
  res.render('expired')
});
// auth logout
router.get('/auth/logout', (req, res) => {
    req.app.locals.user=null;
    res.redirect('/');
});

//Register POST
router.post('/profile/register',function (req,res,next) {
	var username = req.body.username;
	var tel = req.body.tel;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;
  var secretToken = randomstring.generate();

	if (!tel || !email || !password || !password2 ||!username ){
    swal({
      title: "Error!",
      text: "Try to fil all the spaces !",
      icon: "info",
    });
	} else {
		var newUser = new User({
			tel :tel,
			username :username,
			email :email,
			password :password,
      secretToken:secretToken
		});

    User.createUser(newUser,function (err,user) {
      if (err){
        res.status(404).json({message: "Email already taken."});
    	}else {
        async.waterfall([
          function(done) {
            crypto.randomBytes(20, function(err, buf) {
              var token = buf.toString('hex');
              done(err, token);
            });
          },
          function(token, done) {
              if (!newUser) {
                return res.redirect('/users/login');
              }else {
                // console.log('hey am token',token);
                newUser.emailverficationToken = token;
                newUser.emailverficationExpires = Date.now() + 86400000; // 24 hour
                var user = newUser;
                user.save(function(err) {
                  done(err, token, user);
                });
              }
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
              from: 'chegeherman@gmail.com',
              subject: 'Email Verification your account.',
              html: '<b>You’re almost there.</b>Thank you so much for signing up with us.\n\n' +
                    '<b>After your click the link below your account will be automatically activated and you we be able to access it by login in.\n\n</b>'+
                    'Incase your account is not activated after this process please contact us for more information\n\n </b><br>' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n </b><br>' +
                    '<a href="'+'http://' + req.headers.host + '/users/email/' + token +'">'+'http://' + req.headers.host + '/users/email/' + token+'</a>'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
              console.log('mail sent');
              done(err, 'done');
            });
          }
        ], function(err) {
          if (err){
             return next(err);
          console.log('success we have sent an email to your account');
          // res.redirect('/users/login');
        }else {
          res.json({status:"OK"});
          req.app.locals.user = user;
        }
      })
    };
	 	});
	}
});

//profile verification
router.get('/email/:token', function(req, res) {
  User.findOne({ emailverficationToken: req.params.token, emailverficationExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        console.log('email not verified');
        return res.redirect('/users/profile/expired');
      }else {
          user.emailverficationToken = undefined;
          user.emailverficationExpires= undefined;
          user.active = true;
          user.save(function(err) {
            console.log(err);
          });
        }
        return res.redirect('/users/login');
  });
});

router.post('/profile/login', (req, res) =>{
	if(req.body){
		User.findOne({email:req.body.email}).then(user=>{
			if (!user){
        res.status(404).json({message:"User doesn't exist!"});
			} else {
        User.comparePassword(req.body.password, user.password, function (hash, isMatch) {
					if (isMatch){
            if (user.active ===true) {
              res.json({status:"OK"});
              req.app.locals.user = user;
              console.log('user2 is:',req.app.locals.user);
            }else {
              res.status(404).json({message:"Please verify your email to activate your account."});
            }
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
        console.log('email',req.body.email);
        if (!user) {
          return res.redirect('/users/login');
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
        from: 'chegeherman@gmail.com',
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    console.log('success we have sent an email to your account');
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
          return res.redirect('/');
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
            return res.redirect('/users/login');
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
        from: 'chegeherman@gmail.com',
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
    res.redirect('/users/login');
  });
});

module.exports = router;
