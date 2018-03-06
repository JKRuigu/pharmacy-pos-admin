const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  local: {
		username: String,
    tel:String,
    lname:String,
  	password: String
	},
  google:{
    googleId: String,
    username: String,
    thumbnail: String,
    email: String
  },
  facebook: {
		id: String,
	   name: String,
		email: String
	}
});

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.local.password);
}

const User = mongoose.model('user', userSchema);
module.exports = User;
