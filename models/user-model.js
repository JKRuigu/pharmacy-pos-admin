const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passportLocalMongoose = require("passport-local-mongoose");

//User Schema
var UserSchema = mongoose.Schema({
	tel:{
		type:String,
		index:true
	},
	password:{
		type:String
	},
	email:{
		required: true,
		type:String,
		unique: true
	},
	resetPasswordToken:{
		type: String
	},
	emailverficationToken:{
		type: String
	},
	resetPasswordExpires: {
		type: Date
	},
	active: {
	 	type: Boolean,
		default: true
	},
	emailVerficationToken:{
		type: String
	},
	emailverficationExpires: {
		type: Date
	},
	secretToken: {
    type: String
  },
	isAdmin: {
		type: Boolean,
		default: false
	},
  isSuperAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps:true});

UserSchema.plugin(passportLocalMongoose);
const User = module.exports = mongoose.model('User',UserSchema);

module.exports.createUser = function (newUser,callback) {
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
    	});
	});
};

module.exports.getUserByUsername = function (email, callback) {
	const query = {email: email};
	User.findOne(query).then((user)=>{
		callback(null, user);
	}).catch(error=>{
		callback(error, null);
	});
};
//mongodb functions
module.exports.getUserById = function (id,callback) {
	User.findById(id,callback);
};

module.exports.comparePassword = function (candidatePassword,hash,callback) {
	bcrypt.compare(candidatePassword, hash, function (err,isMatch) {
		if (err) throw err;
		callback(null, isMatch);
	});
};
