const router = require('express').Router();

//  isLoggedIn function
function isLoggedIn(req, res, next) {
  req.admin = req.app.locals.admin;
  if (!req.admin) {
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

  router.get('/*',isLoggedIn,(req,res)=>{
    res.render('admin',{admin:req.admin});
  });

module.exports= router;
