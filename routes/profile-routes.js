const router = require('express').Router();


//authenticate function
const authCheck = (req,res,next)=>{
  if (!req.user) {
    res.redirect('/');
  }else {
    next();
  }
}

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

router.get('/*',authCheck,(req,res)=>{
  res.render('users/profile',{user:req.user});
});


module.exports= router;
