const router = require('express').Router();

//authenticate function
const authCheck = (req,res,next)=>{
  if (!req.user) {
    // TODO:: Redirect to login instead
    res.redirect('/');
  }else {
    next();
  }
};

//Users profile-dashboard
router.get('/',authCheck,(req,res)=>{
  res.render('profile',{user:req.user});
});

//contact
router.get('/contact',authCheck,(req,res)=>{
  res.render('contact',{user:req.user});
});

//more
router.get('/services',authCheck,(req,res)=>{
  res.render('services',{user:req.user});
});

//Updates
router.get('/update',authCheck,(req,res)=>{
  res.render('update',{user:req.user});
});

//Admin
router.get('/*',authCheck,(req,res)=>{
  res.render('profile',{user:req.user});
});


module.exports = router;
