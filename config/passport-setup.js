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
passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our own db
        User.findOne({'google.googleId': profile.id}).then((currentUser) => {
            if(currentUser){
                // already have this user
                // console.log(profile);
                // console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                // if not, create user in our db
                var newUser = new User();
  	    				newUser.google.googleId = profile.id;
                newUser.google.username = profile.displayName;
                newUser.google.thumbnail = profile._json.image.url;
                newUser.google.email = profile.emails[0].value;
                newUser.save().then((newUser) => {
                  //  console.log('created new user: ', newUser);
                    done(null, newUser);
                });
            }
        });
    })
);

//FacebookStrategy
passport.use(
    new FacebookStrategy({
        // options for google strategy
        clientID: keys.facebook.clientID,
        clientSecret: keys.facebook.clientSecret,
        callbackURL: '/auth/facebook/redirect',
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our own db
        User.findOne({'facebook.id': profile.id}).then((currentUser) => {
            if(currentUser){
                // already have this user
                //console.log('user is: ', emails);
                done(null, currentUser);
            }else {
	    				var newUser = new User();
	    				newUser.facebook.id = profile.id;
	    				newUser.facebook.name = profile.displayName;
              newUser.facebook.email = '';
	    				newUser.save(function(err){
	    					if(err)
	    						throw err;
	    					return done(null, newUser);
	    				})
	    				console.log(profile.displayName);
	    			}
        });
    })
);
// LocalStrategy
passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
  //  lnameField: 'lname',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){
			User.findOne({'local.username': email}, function(err, user){
				if(err)
					return done(err);
				if(user){
					return done(null, false
          , req.flash('signupMessage', 'That email already taken')
          );
				} else {
        var newUser = new User();
					newUser.local.username = email;
        //  newUser.local.lname = lname;
        //  newUser.local.tel = tel;
        //  newUser.local.tel = tel;
					newUser.local.password = newUser.generateHash(password);

					newUser.save(function(err){
						if(err)
							throw err;
             req.app.locals.newUser = newUser;
						return done(null,newUser);
					})
				}
			})
		});
	}));

	passport.use('local-login', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, email, password, done){
			process.nextTick(function(){
				User.findOne({ 'local.username': email}, function(err, user){
					if(err)
						return done(err);
					if(!user)
						return done(null, false
            , req.flash('loginMessage', 'No User found')
            );
					if(!user.validPassword(password)){
						return done(null, false
            , req.flash('loginMessage', 'invalid password')
            );
					}

					return done(null, user);
				});
			});
		}
	));
