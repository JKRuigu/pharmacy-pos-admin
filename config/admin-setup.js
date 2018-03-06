const passport = require('passport');
const Admin = require('../models/admin-model');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(admin, done) {
   done(null, admin.id);
});

//passport deserializeAdmin
passport.deserializeUser((id, done) => {
  Admin.findById(id).then((admin) => {
    done(null, admin);
  });
});


passport.use('local-admin', new LocalStrategy({
		usernameField: 'email',
  //  lnameField: 'lname',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){
			Admin.findOne({'admins.username': email}, function(err, admin){
				if(err)
					return done(err);
				if(admin){
					return done(null, false
          , req.flash('signupMessage', 'That email already taken')
          );
				} else {
        var newAdmin = new Admin();
					newAdmin.admins.username = email;
					// newAdmin.admins.lname = lname;
					// newAdmin.admins.fname = fname;
					newAdmin.admins.password = newAdmin.generateHash(password);
					newAdmin.save(function(err){
						if(err)
							throw err;
						return done(null, newAdmin);
					})
				}
			})

		});
	}));

  ///test
  passport.use('admin-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done){
      process.nextTick(function(){
        Admin.findOne({ 'admins.username': email}, function(err, admin){
          if(err)
            return done(err);
          if(!admin)
            return done(null, false
            , req.flash('loginMessage', 'No User found')
            );
          if(!admin.validPassword(password)){
            return done(null, false
            , req.flash('loginMessage', 'invalid password')
            );
          }
          req.app.locals.admin = admin;
          done(null,admin)
          return done(null, admin);
        });
      });
    }
  ));
