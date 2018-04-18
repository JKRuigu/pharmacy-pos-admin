const router = require('express').Router();
const MongoClient = require("mongodb").MongoClient;
const url = require('../config/keys').mongodb.dbURI;
const Message = require('../models/Messages');
const Update = require('../models/Updates');
const Subscription = require('../models/Subscriptions');
const moment = require('moment');
const ObjectId = require('mongodb').ObjectId;

const authCheck = (req,res,next)=>{
  if (!req.isAuthenticated()) {
    res.redirect('/users/login');
  }else if (req.user.isAdmin ===true) {
    res.redirect('/admin/admin');
  }else {
    next();
  }
};

const addSubscription = (req, res, next) =>{
  if(req.body.status === 'COMPLETED') {
    Subscription.findOne({_id: req.body.id}).then(transaction =>{
      var now = moment();
      var expiryDate = now;
      var selected = transaction.item;
      var qty = transaction.quantity;
      if (selected === 'monthly'){
        expiryDate = now.add(parseInt(qty), 'months');
      } else if (selected === 'yearly'){
        expiryDate = now.add(parseInt(qty), 'years');
      } else if (selected === 'lifetime'){
        expiryDate = now.add(10, 'years');
      }
      let data = {
        expiryDate: expiryDate._d,
        activationDate: moment()._d,
        status: 1,
        pesapalId: transaction.pesapalId,
        subscriptionId: transaction._id
      };
      MongoClient.connect(url).then(client =>{
        let db = client.db('pharmacy-pos');
        db.collection('users').update(
          {_id:ObjectId(transaction.customerId)},
          {$push:{subscriptions: data}}).then( (user)=>{
          next();
        }).catch(error => {
          res.status(404).json({message:error.message});
        });
        client.close();
      }).catch( error => {
        res.status(404).json({message:error.message});
      });
    }).catch(error =>{
      console.log(error);
    });
  } else {
    next();
  }
};

router.get('/',authCheck,(req,res)=>{
  res.render('users/profile', {user:req.user});
});

router.get('/contact',authCheck,(req,res)=>{
  res.render('users/contact',{user:req.user});
});

router.get('/cart',authCheck, (req,res)=>{
  res.render('users/checkout',{user:req.user});
});

router.get('/services', authCheck, (req,res)=>{
  res.render('users/services',{user:req.user});
});

router.get('/subscriptions', authCheck, (req,res)=>{
  Subscription.find({customerId: req.user._id}).sort({'createdAt':-1}).then(cart => {
    res.render('users/subscriptions', {user:req.user, cart});
  }).catch(error => {
    console.log(error);
  });
});

router.get('/help',authCheck,(req,res)=>{
  res.render('users/help',{user:req.user});
});

router.get('/updates',authCheck,(req,res)=>{
  let isBiashara = req.hostname == 'biasharapos.com';
  let isPharmacy = req.hostname == 'pharmacypluspos.com';
  Update.find({$or:[{isPharmacy:isPharmacy}, {isBiashara: isBiashara}] }).sort({'createdAt':-1}).then(updates =>{
    res.render('users/updates',{user:req.user, updates});
  }).catch(error =>{
    res.send(error.message);
  });
});

router.get('/cart', authCheck, (req, res) => {
  res.render('users/checkout', {user:req.user});
});

router.post('/cart', (req, res) =>{
  let subscription = new Subscription({
    item: req.body.item,
    quantity: req.body.quantity,
    amount: req.body.total,
    date: new Date().getTime(),
    isPharmacy: req.hostname==='pharmacypluspos.com',
    isBiashara: req.hostname==='biasharapos.com',
    customerId: req.user._id
  });
  subscription.save().then(subscription =>{
    res.json({subscription});
  }).catch(error =>{
    res.status(505).json({error: error.message});
  })
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

router.post('/cart/pesapalUpdate', addSubscription, (req, res) =>{
  Subscription.findOne({_id: req.body.id}).then( transaction =>{
    transaction.pesapalId = req.body.pesapalId;
    if(req.body.status === 'COMPLETED')
      transaction.status = 1;
    if (req.body.status=== 'FAILED')
      transaction.status = 3;
    if(req.body.status === 'PENDING')
      transaction.status = 0;
    transaction.save();
    res.json({message: 'OK'});
  }).catch(error  =>{
    console.log(error);
  })
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
// //username edit
// router.post('/:id/edit', authCheck, (req, res) =>{
//   console.log(req.body);
//   if(req.body) {
//     MongoClient.connect(url).then(client =>{
//       let db = client.db('pharmacy-pos');
//       db.collection('users').update(
//         {_id:ObjectId(req.params.userId)},
//         {$set:{username: req.body}}).then( ()=>{
//         res.json({status:'ok'});
//       }).catch(error => {
//         res.status(404).json({message:error.message});
//       });
//       client.close();
//     }).catch( error => {
//       res.status(404).json({message:error.message});
//     });
//   } else {
//     res.status(404).json({message:"Send a valid body"});
//   }
// });

module.exports = router;
