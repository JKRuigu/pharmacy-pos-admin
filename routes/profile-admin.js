const router = require('express').Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const User = require('../models/user-model');
const url = process.env.DB_MLAB;

// Middleware ~ check if user is logged in and is admin.
function isLoggedIn(req, res, next) {
  req.admin = req.app.locals.user;
  if (req.admin === undefined || !req.admin.isAdmin) {
    res.redirect('/users/login');
  }else {
    next();
  }
}

function isSuperAdmin(req, res, next) {
  if(req.admin.isSuperAdmin)
    next();
  else
    res.status(404).json({status: "You are not allowed to perform this action."})
}

// Handle get requests with /admin/*
router.get('/',isLoggedIn,(req,res)=>{
  res.render('admin/admin', {admin:req.admin});
});

router.get('/ad-messages', isLoggedIn, (req,res)=>{
  res.render('admin/ad-messages', {admin:req.admin});
});

router.get('/ad-updates', isLoggedIn, (req,res)=>{
  res.render('admin/ad-updates', {admin:req.admin});
});

router.get('/ad-users', isLoggedIn, (req,res)=>{
  res.render('admin/ad-users', {admin:req.admin});
});

router.get('/subscriptions', isLoggedIn, (req, res) =>{
  User.find({}).then(users =>{
    res.render('admin/index', {admin:req.admin, users});
  }).catch(error =>{
    res.send(error.message);
  });
});

router.get('/admins', isLoggedIn, (req, res) =>{
  User.find({isAdmin: true}).then(users =>{
    res.render('admin/super-admin', {admin:req.admin, admins:users});
  }).catch(error =>{
    res.send(error.message);
  });
});

router.get('/logout', function(req, res){
  res.app.locals.user = undefined;
  res.redirect('/users/login');
});

router.get('/*', isLoggedIn, (req,res)=>{ // Wildcard route for insane people :)
  res.render('admin', {admin:req.admin});
});


// Handle POST and UPDATE request to /admin/*
router.post('/:userId/activate', isLoggedIn, (req, res) =>{
  if(req.body) {
    MongoClient.connect(url).then(client =>{
      let db = client.db('pharmacy-pos');
      db.collection('users').update(
        {_id:ObjectId(req.params.userId)},
        {$push:{subscriptions: req.body}}).then( ()=>{
        res.json({status:'ok'});
      }).catch(error => {
        res.status(404).json({message:error.message});
      });
      client.close();
    }).catch( error => {
     res.status(404).json({message:error.message});
    });
  } else {
    res.status(404).json({message:"Send a valid body"});
  }
});


router.post('/:userId/deactivate', isLoggedIn, (req, res) =>{
  if(req.body) {
    MongoClient.connect(url).then(client =>{
      let db = client.db('pharmacy-pos');
      db.collection('users').update(
        {_id:ObjectId(req.params.userId)},
        {$set:{subscriptions: req.body}}).then( ()=>{
        res.json({status:'ok'});
      }).catch(error => {
        res.status(404).json({message:error.message});
      });
      client.close();
    }).catch( error => {
      res.status(404).json({message:error.message});
    });
  } else {
    res.status(404).json({message:"Send a valid body"});
  }
});

router.post('/register', isLoggedIn, isSuperAdmin, (req, res) =>{
  let data = req.body;
  if(data) {
    if (!data.username || !data.password || !data.email || !data.passwordAgain)
      res.status(404).json({status: 'All the field are required.'});
    else {
     if (data.password !== data.passwordAgain)
       res.status(404).json({status: "Passwords don't match"});
     else if (!data.admin && !data.superAdmin){
       res.status(404).json({status: 'Please set at least one role.'})
     } else {
       var user = new User({
         username: data.username,
         email: data.email,
         password: data.password,
         isAdmin: data.superAdmin ? data.superAdmin: data.admin,
         isSuperAdmin: data.superAdmin,
         active: true
       });
       User.createUser(user, function (error, user) {
         if (error)
           res.status(404).json({status: error.message});
         else
           res.json({status: 'Added successfully.'});

       });
     }
    }
  } else {
    res.status(404).json({message:"Send a valid body"});
  }
});

router.delete('/:userId/delete', isLoggedIn, (req, res) =>{
  MongoClient.connect(url).then(client =>{
    let db = client.db('pharmacy-pos');
    db.collection('users').deleteOne({_id:ObjectId(req.params.userId)}).then( ()=>{
      res.json({status:'ok'});
    }).catch(error => {
      res.status(404).json({message:error.message});
    });
    client.close();
  }).catch( error => {
    res.status(404).json({message:error.message});
  });
});

module.exports= router;
