const router = require('express').Router();
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const keys = require('../config/keys');
const randomstring = require('randomstring');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user-model');


router.get('/profile/expired',(req,res)=>{
  res.render('expired')
});

router.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/users/login');
});


router.post('/profile/register', passport.authenticate('local-signup', {
  successRedirect : '/users/redirect',
  failureRedirect : '/users/login',
  failureFlash : true
}));

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

passport.use('local-signup', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    }, function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({email:email}, function(err, user) {
        if (err) return done(err);
        if (user) {
          return done(null, false, req.flash('message', 'Email is already taken.'));
        } else {
          var newUser = new User({
            tel: req.body.tel,
            username: req.body.username,
            email: email,
            password: password,
            secretToken: randomstring.generate()
          });
          User.createUser(newUser, function (err, user) {
            if (err) {
              return done(null, false, req.flash('message', 'Error adding creating your account.'));
            } else {
              return done(null, user);
            }
          });
        }
      });
    });
  })
);

passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, function(req, username, password, done) {
    process.nextTick(function () {
      User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user){
          return done(null, false, req.flash('message', 'User doesn\'t exist.'));
        }
        User.comparePassword(password, user.password, function(err, isMatch){
          if(err) throw err;
          if(isMatch){
            return done(null, user);
          } else {
            return done(null, false, req.flash('message', 'Incorrect email/password.'));
          }
        });
      });
    })
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/profile/login', passport.authenticate('local-login', {
    successRedirect:'/users/redirect',
    failureRedirect:'/users/login',
    failureFlash: true
  })
);

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
