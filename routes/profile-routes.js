const router = require('express').Router();


//authenticate function
const authCheck = (req,res,next)=>{
  if (!req.user) {
    res.redirect('/login');
  }else {
    next();
  }
}

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

// //Admin
// router.get('/login-admin',authCheck,(req,res)=>{
//   res.render('login-admin',{user:req.user});
// });
router.get('/*',authCheck,(req,res)=>{
  res.render('profile',{user:req.user});
});



module.exports= router;
