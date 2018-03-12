const router = require('express').Router();

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = 'mongodb://jkruigu:pharmacy-pos@ds237858.mlab.com:37858/pharmacy-pos';
//  isLoggedIn function
function isLoggedIn(req, res, next) {
  req.admin = req.app.locals.admin;
  if (!req.admin) {
    // TODO :: Redirect to login
    res.redirect('/');
  }else {
    next();
  }
}

// Admin home route
  router.get('/',isLoggedIn,(req,res)=>{
    res.render('admin',{admin:req.admin});
  });


  //Admin messages
  router.get('/ad-messages',isLoggedIn,(req,res)=>{
    res.render('ad-messages',{admin:req.admin});
  });

  //Admin Updates
  router.get('/ad-updates',isLoggedIn,(req,res)=>{
    res.render('ad-updates',{admin:req.admin});
  });

  //Admin Users control-panel
  router.get('/ad-users',isLoggedIn,(req,res)=>{
    res.render('ad-users',{admin:req.admin});
  });
  //Admin register control-panel
  router.get('/ad-register',isLoggedIn,(req,res)=>{
    res.render('ad-register',{admin:req.admin});
  });

  router.get('/subscriptions', (req, res) =>{
    res.render('subscription/index');
  });

  router.post('/:userId/activate', (req, res) =>{
    if(req.body) {
      MongoClient.connect(url).then(client =>{
        console.log("Connected successfully to server");
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


  router.get('/*',isLoggedIn,(req,res)=>{
    res.render('admin',{admin:req.admin});
  });

module.exports= router;
