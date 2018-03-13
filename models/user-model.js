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
		type:String
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

module.exports.getUserByUsername = function (username,callback) {
	var query = {username: email};
	User.findOne(query,callback);
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
