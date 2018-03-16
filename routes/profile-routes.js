const router = require('express').Router();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = 'mongodb://jkruigu:pharmacy-pos@ds237858.mlab.com:37858/pharmacy-pos';



//authenticate function
const authCheck = (req,res,next)=>{
  user=req.app.locals.user;
  req.user=req.app.locals.user;
  console.log('req.user is',req.user);
  if (!user) {
    // TODO:: Redirect to login instead
    res.redirect('/');
  }else {
    // MongoClient.connect(url).then(client =>{
    //   let db = client.db('pharmacy-pos');
    //   db.collection('users').find({_id:ObjectId(req.params.userId)}).then( (user)=>{
    //     res.user = user;
    //   }).catch(error => {
    //     res.status(404).json({message:error.message});
    //   });
    //   client.close();
    // }).catch( error => {
    //   res.status(404).json({message:error.message});
    // });
    next();
  }
};

//Users profile-dashboard
router.get('/',authCheck,(req,res)=>{
  // console.log('Users profile-dashboard',req.user);
  res.render('users/profile');
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
router.get('/updates',authCheck,(req,res)=>{
  res.render('users/updates',{user:req.user});
});

//Subscription status
router.get('/subscription',(req,res)=>{
  res.render('users/users');
});

//Subscription status
router.get('/license/subscription' ,(req,res)=>{
  res.header("Access-Control-Allow-Origin", '*');
  if (req.query){
    const email = req.query.email.trim();
    MongoClient.connect(url).then(client =>{
      let db = client.db('pharmacy-pos');
      db.collection('users').findOne({email:email}).then( (user)=>{
        if (!user)
          res.status(404).json({message:"Email doesn't exist...!!"});
        else{
          if(user.subscriptions)
            res.json({subscriptions:user.subscriptions});
          else
            res.status(404).json({message:"No subscriptions found...!!"});
        }
      }).catch(error => {
        res.status(404).json({message:error.message});
      });
      client.close();
    }).catch( error => {
      res.status(404).json({message:error.message});
    });
  } else {
    res.status(404).json({message:"Invalid email...!!"});
  }
});

//Admin
router.get('/*',authCheck,(req,res)=>{
  res.render('users/profile',{user:req.user});
});
//users registration

module.exports = router;
