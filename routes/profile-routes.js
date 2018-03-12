const router = require('express').Router();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = 'mongodb://jkruigu:pharmacy-pos@ds237858.mlab.com:37858/pharmacy-pos';
//authenticate function
const authCheck = (req,res,next)=>{
  if (!req.user) {
    // TODO:: Redirect to login instead
    res.redirect('/');
  }else {
    MongoClient.connect(url).then(client =>{
      let db = client.db('pharmacy-pos');
      db.collection('users').find({_id:ObjectId(req.params.userId)}).then( (user)=>{
        res.user = user;
      }).catch(error => {
        res.status(404).json({message:error.message});
      });
      client.close();
    }).catch( error => {
      res.status(404).json({message:error.message});
    });
    next();
  }
};

//Users profile-dashboard
router.get('/',authCheck,(req,res)=>{
  res.render('users/profile',{user:req.user});
});

//contact
router.get('/contact',authCheck,(req,res)=>{
  res.render('users/contact',{user:req.user});
});

//more
router.get('/services',authCheck,(req,res)=>{
  res.render('users/services',{user:req.user});
});

//Updates
router.get('/update',authCheck,(req,res)=>{
  res.render('update',{user:req.user});
});

//Subscription status
router.get('/subscription',authCheck,(req,res)=>{
  res.render('subscription/users',{user:req.user});
});

//Subscription status
router.get('/:userId/subscription' ,(req,res)=>{
  MongoClient.connect(url).then(client =>{
    let db = client.db('pharmacy-pos');
    db.collection('users').findOne({_id:ObjectId(req.params.userId)}).then( (user)=>{
      res.json({subscriptions:user.subscriptions});
    }).catch(error => {
      res.status(404).json({message:error.message});
    });
    client.close();
  }).catch( error => {
    res.status(404).json({message:error.message});
  });
});

//Admin
router.get('/*',authCheck,(req,res)=>{
  res.render('users/profile',{user:req.user});
});

module.exports = router;
