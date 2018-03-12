const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');
const LocalStrategy = require('passport-local').Strategy;
const swal = require('sweetalert');



passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});


//GoogleStrategy
        passport.use(new GoogleStrategy({
    	    clientID: keys.google.clientID,
    	    clientSecret: keys.google.clientSecret,
    	    callbackURL: '/auth/google/redirect',
    	    passReqToCallback: true
        	  },
        	  function(req, accessToken, refreshToken, profile, done) {
        	    	process.nextTick(function(){

        	    		if(!req.user){
        	    			User.findOne({'google.id': profile.id}, function(err, user){
        		    			if(err)
        		    				return done(err);
        		    			if(user)
        		    				return done(null, user);
        		    			else {
        		    				var newUser = new User();
        		    				newUser.google.id = profile.id;
        		    				newUser.google.token = accessToken;
        		    				newUser.google.username = profile.displayName;
        		    				newUser.google.email = profile.emails[0].value;

        		    				newUser.save(function(err){
        		    					if(err)
        		    						throw err;
        		    					return done(null, newUser);
        		    				})
        		    			}
        		    		});
        	    		} else {
        	    			var user = req.user;
        	    			user.googleplus.id = profile.id;
        					user.googleplus.token = accessToken;
        					user.googleplus.username = profile.displayName;
        					user.googleplus.email = profile.emails[0].value;

        					user.save(function(err){
        						if(err)
        							throw err;
        						return done(null, user);
        					});
        	    		}

        	    	});
        	    }

        	));


//FacebookStrategy
        passport.use(new FacebookStrategy({
        	    clientID: keys.facebook.clientID,
        	    clientSecret: keys.facebook.clientSecret,
        	    callbackURL: '/auth/facebook/redirect',
        	    passReqToCallback: true
        	  },
        	  function(req, accessToken, refreshToken, profile, done) {
        	    	process.nextTick(function(){
        	    		//user is not logged in yet
        	    		if(!req.user){
        					User.findOne({'facebook.id': profile.id}, function(err, user){
        		    			if(err)
        		    				return done(err);
        		    			if(user)
        		    				return done(null, user);
        		    			else {
        		    				var newUser = new User();
        		    				newUser.facebook.id = profile.id;
        		    				newUser.facebook.token = accessToken;
        		    				newUser.facebook.name = profile.displayName;
        		    				// newUser.facebook.email = profile.emails[0].value;

        		    				newUser.save(function(err){
        		    					if(err)
        		    						throw err;
                            console.log(profile);
        		    					return done(null, newUser);
        		    				})
        		    			}
        		    		});
        	    		}

        	    		//user is logged in already, and needs to be merged
        	    		else {
        	    			var user = req.user;
        	    			user.facebook.id = profile.id;
        	    			user.facebook.token = accessToken;
        	    			user.facebook.name = profile.displayName;
        	    			// user.facebook.email = profile.emails[0].value;

        	    			user.save(function(err){
        	    				if(err)
        	    					throw err
        	    				return done(null, user);
        	    			})
        	    		}

        	    	});
        	    }

        	));

// // LocalStrategy
// passport.use('local-signup', new LocalStrategy({
// 		usernameField: 'email',
//   //  lnameField: 'lname',
// 		passwordField: 'password',
// 		passReqToCallback: true
// 	},
// 	function(req, email, password, done){
// 		process.nextTick(function(){
// 			User.findOne({'local.username': email}, function(err, user){
// 				if(err)
// 					return done(err);
// 				if(user){
// 					return done(null, false
//           , req.flash('signupMessage', 'That email already taken')
//           );
// 				} else {
//         var newUser = new User();
// 					newUser.local.username = email;
//         //  newUser.local.lname = lname;
//         //  newUser.local.tel = tel;
//         //  newUser.local.tel = tel;
// 					newUser.local.password = newUser.generateHash(password);
//
// 					newUser.save(function(err){
// 						if(err)
// 							throw err;
//              req.app.locals.newUser = newUser;
// 						return done(null,newUser);
//
// 					})
// 				}
// 			})
// 		});
// 	}));

	passport.use('local-login', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, email, password, done){
			process.nextTick(function(){
				User.findOne({ 'local.email': email}, function(err, user){
					if(err)
						return done(err);
					if(!user)
						return done(null, false
            , req.flash('loginMessage', 'No User found')
            );
					if(!User.validPassword(password)){
						return done(null, false
            , req.flash('loginMessage', 'invalid password')
            );
					}

					return done(null, user);
				});
			});
		}
	));
