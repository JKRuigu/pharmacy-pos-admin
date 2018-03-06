const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const adminRoutes = require('./routes/auth-admin');
// const photoUpload = require('./routes/photo-upload');
const profileRoutes = require('./routes/profile-routes');
const profileAdmin = require('./routes/profile-admin');
const passportSetup = require('./config/passport-setup');
const adminSetup = require('./config/admin-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const multer = require('multer');


//App initialize
const app = express();
const router = express.Router()
// set view engine
app.set('view engine', 'ejs');


app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
// set up session cookies
app.use(cookieSession({
    maxAge: 12 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));
// app.locals

// app.use(cookieSession({
//   name: 'session',
//   keys: [keys.session.cookieKey],
//
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }))


// initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session

// connect to mongodb
mongoose.connect(keys.mongodb.dbURI, () => {
    console.log('connected to mongodb');
});

app.use('/*', (req, res, next) =>{
  req.app.locals.test = "test";
  next();
});

// set up routes
 // app.use('/admin',profileAdmin);
app.use(authRoutes);
app.use(adminRoutes);
app.use('/profile', profileRoutes);
app.use('/admin', profileAdmin);


// create home route
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});
// // create Admin route
// app.get('/', (req, res) => {
//     res.render('home', { user: req.user });
// });
app.use(express.static(__dirname + '/public'));
// app.use(function (req, res, next) {
//   console.log('Time:', Date.now())
//   next()
// })
//Set port
app.set('port',(process.env.PORT || 3001));

app.listen(app.get('port'),function () {
	console.log('Server started on port ' +app.get('port'))
});
