const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user-model');
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const keys = require('../config/keys');
const swal = require('sweetalert2')
const randomstring = require('randomstring');
const $ = require("jquery");

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
    res.redirect('/users/login');
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

    User.createUser(newUser,function (err, user) {
      if (err){
        res.status(404).json({message: "Email already taken."});
    	}else {
//Email verification
      //   async.waterfall([
      //     function(done) {
      //       crypto.randomBytes(20, function(err, buf) {
      //         var token = buf.toString('hex');
      //         done(err, token);
      //       });
      //     },
      //     function(token, done) {
      //         if (!newUser) {
      //           return res.redirect('/users/login');
      //         }else {
      //           // console.log('hey am token',token);
      //           newUser.emailverficationToken = token;
      //           newUser.emailverficationExpires = Date.now() + 86400000; // 24 hour
      //           var user = newUser;
      //           user.save(function(err) {
      //             done(err, token, user);
      //           });
      //         }
      //     },
      //     function(token, user, done) {
      //       var smtpTransport = nodemailer.createTransport({
      //         service: 'Gmail',
      //         auth: {
      //           user: keys.facebook.clientID,
      //           pass: keys.facebook.clientSecret
      //         }
      //       });
      //       var mailOptions = {
      //         to: user.email,
      //         from: 'chegeherman@gmail.com',
      //         subject: 'Email Verification your account.',
      //         html: '<b>You’re almost there.</b>Thank you so much for signing up with us.\n\n' +
      //               '<b>After your click the link below your account will be automatically activated and you we be able to access your account by loging in.\n\n</b>'+
      //               'Incase your account is not activated after this process please contact us for more information.\n\n </b><br>' +
      //               'Please click on the following link, or paste this into your browser to complete the process:\n\n </b><br>' +
      //               '<a href="'+'http://' + req.headers.host + '/users/email/' + token +'">'+'http://' + req.headers.host + '/users/email/' + token+'</a>'
      //       };
      //       smtpTransport.sendMail(mailOptions, function(err) {
      //         res.json({status:"OK"});
      //       });
      //     }
      //   ], function(err) {
      //     res.json({status:error});
      // })
      req.app.locals.user = user;
      console.log(user);
      res.json({status:"OK"});
    };
	 	});
	}
});

//profile verification
// router.get('/email/:token', function(req, res,next) {
//   User.findOne({ emailverficationToken: req.params.token, emailverficationExpires: { $gt: Date.now() } }, function(err, user) {
//       if (!user) {
//           return res.redirect('/users/login');
//       }else {
//           user.emailverficationToken = undefined;
//           user.emailverficationExpires= undefined;
//           user.active = true;
//           user.save(function(err) {
//             console.log(err);
//           });
//         }
//         return res.redirect('/users/login');
//   });
// });

router.post('/profile/login', (req, res) =>{
	if(req.body){
		User.findOne({email:req.body.email}).then(user=>{
			if (!user){
        res.status(404).json({message:"User doesn't exist!"});
			} else {
        User.comparePassword(req.body.password, user.password, function (hash, isMatch) {
					if (isMatch){
            if (user.active ===true) {
              res.json({status:"OK", isAdmin: user.isAdmin});
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
  var email = req.body.email;
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
            res.status(404).json({message: "Your Email doesn't exist."});
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
          from: 'pharmacypluspos@gmail.com',
          subject: 'Password Reset',
          text: 'You are receiving this because you (or someone else) has requested to reset the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://pharmacypluspos.com/users/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          res.json({status:"OK"});

        });
      }
    ], function(err) {
      res.json({status:error});
    });
});


router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      res.redirect('users/expired');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res,next) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            res.status(404).json({message: "Your token has already expired."});
          }
          if(req.body.password === req.body.password2) {
            User.createUser(user, function(err, user) {
                bcrypt.genSalt(10, function(err, salt) {
              	    bcrypt.hash(req.body.password, salt, function(err, hash) {
              	        user.password = hash;
                        user.resetPasswordExpires = undefined;
                        user.resetPasswordToken = undefined;
              	        user.save().then(function () {
                          res.json({status:"OK"});
                          next();
                        });
                  	});
              });
            })
          } else {
            res.status(404).json({message: "Your passwords do not match."});
          }
        });
      },
      function(user, done) {
        console.log(user);
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
          res.json({status:"OK"});
        });
      }
    ], function(err) {
      res.json({status:error});
    });
});

module.exports = router;
