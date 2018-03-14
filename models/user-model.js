var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');



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
		type:String,
		unique: true
	}
});

//Expor module
var User = module.exports = mongoose.model('User',UserSchema);

module.exports.createUser = function (newUser,callback) {
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
    	});
	});
}

module.exports.getUserByUsername = function (email) {
	var query = {email: email};
	User.findOne(query).then((user)=>{
		return user;
	}).catch(error=>{
		console.log(error);
		return error;
	});
}
//mongodb functions
module.exports.getUserById = function (id,callback) {
	User.findById(id,callback);
}

module.exports.comparePassword = function (candidatePassword,hash,callback) {
	bcrypt.compare(candidatePassword, hash, function (err,isMatch) {
		if (err) throw err;
		callback(null, isMatch);
	});
}
