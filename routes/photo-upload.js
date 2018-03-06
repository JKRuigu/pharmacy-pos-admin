// const router = require('express').Router();
// const multer = require('multer');
// const path = require('path');
// const profileRoutes = require('./routes/profile-routes');
//
// // Set The Storage Engine
// const storage = multer.diskStorage({
//   destination: './public/uploads/',
//   filename: function(req, file, cb){
//     cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });
//
// // Init Upload
// const upload = multer({
//   storage: storage,
//   limits:{fileSize: 15000000},
//   fileFilter: function(req, file, cb){
//     checkFileType(file, cb);
//   }
// }).single('myImage');
//
// // Check File Type
// function checkFileType(file, cb){
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif/;
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);
//
//   if(mimetype && extname){
//     return cb(null,true);
//   } else {
//     cb('Error: Images Only!');
//   }
// }
//
//
// router.post('/profile/upload', (req, res) => {
//   upload(req, res, (err) => {
//     if(err){
//       res.render('/profile/update', {
//         msg: err
//       });
//     } else {
//       if(req.file == undefined){
//         res.render('/profile/update', {
//           msg: 'Error: No File Selected!'
//         });
//       } else {
//         res.render('/profile/update', {
//           msg: 'File Uploaded!',
//           file: `uploads/${req.file.filename}`
//         });
//       }
//     }
//   });
// });
//
// module.exports = router;
