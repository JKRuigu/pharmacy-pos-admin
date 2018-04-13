const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const profileAdmin = require('./routes/profile-admin');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();
// const Mongoconnect = require('mongo-connect');

const app = express(); //App initialize
app.set('view engine', 'ejs'); // set view engine
app.set('port',(process.env.PORT || 3000));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  name: 'ppos-session',
  secret: process.env.SESSIONKEY,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/node',express.static(__dirname + '/public'));

mongoose.connect(keys.mongodb.dbURI, ()=>{
    console.log('connected to mongodb');
});

app.use('/users', authRoutes);
app.use('/users/profile', profileRoutes);
app.use('/admin', profileAdmin);
app.get('/users/login', (req, res) => {
  if (req.isAuthenticated()){
    if(req.user.isAdmin)
      res.redirect('/admin/');
    else
      res.redirect('/users/profile');
  } else {
    res.render('home', { user: req.user , message: req.flash('message') });
  }
});
//package page
app.get('/users/package', (req, res) => {
    res.render('package');
});
//payment page
app.get('/users/cart', (req, res) => {
    res.render('checkout');
});

app.get('/users/redirect', (req, res) =>{
  if(req.user.isAdmin)
    res.redirect('/admin/');
  else
    res.redirect('/users/profile');
});

app.listen(app.get('port'), () =>{
	console.log('Server started on port ' + app.get('port'))
});
