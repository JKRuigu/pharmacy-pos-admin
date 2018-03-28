const router = require('express').Router();
const MongoClient = require("mongodb").MongoClient;
const url = require('../config/keys').mongodb.dbURI;
const Message = require('../models/Messages');
const Update = require('../models/Updates');

//authenticate function
const authCheck = (req,res,next)=>{
  user=req.app.locals.user;
  req.user=req.app.locals.user;
  if (!user) {
    res.redirect('/users/login');
  }else {
    next();
  }
};

router.get('/',authCheck,(req,res)=>{
  res.render('users/profile');
});

router.get('/contact',authCheck,(req,res)=>{
  res.render('users/contact',{user:req.user});
});

router.get('/services',authCheck,(req,res)=>{
  res.render('users/services',{user:req.user});
});

router.get('/updates',authCheck,(req,res)=>{
  Update.find({}).sort({'createdAt':-1}).then(updates =>{
    res.render('users/updates',{user:req.user, updates});
  }).catch(error =>{
    res.send(error.message);
  });
});

router.get('/subscription',(req,res)=>{
  res.render('users/users');
});

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


router.get('/*',authCheck,(req,res)=>{
  res.render('users/profile',{user:req.user});
});

router.post('/messages', authCheck, (req, res) =>{
  if (req.body){
    let {name, email, body, tel} = req.body;
    if (!name || !email || !body)
      res.status(404).json({status: "Provide a message body"});
    else {
      let message = new Message({
        name, email, tel, body
      });
      message.save().then(message =>{
        res.json({status: 'ok'});
      }).catch(error =>{
        res.status(404).json({status: error.message});
      });
    }
  } else {
    res.status(404).json({status: "No body for the message."})
  }
});

module.exports = router;
