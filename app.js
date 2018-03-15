const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const adminRoutes = require('./routes/auth-admin');
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

const app = express(); //App initialize
app.set('view engine', 'ejs'); // set view engine
app.set('port',(process.env.PORT || 3001));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieSession({ maxAge: 12 * 60 * 60 * 1000, keys: [keys.session.cookieKey]}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(__dirname + '/public'));


// connect to mongodb
mongoose.connect(keys.mongodb.dbURI, () => {
    console.log('connected to mongodb');
});

// set up routes
app.use(authRoutes);
app.use(adminRoutes);
app.use('/profile', profileRoutes);
app.use('/admin', profileAdmin);


// create home route
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

app.listen(app.get('port'), () =>{
	console.log('Server started on port ' + app.get('port'))
});
