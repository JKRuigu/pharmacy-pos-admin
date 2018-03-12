const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  google:{
    id: String,
    token: String,
    username: String,
    thumbnail: String,
    email: String
  },
  googleplus:{
    id: String,
    token: String,
    username: String,
    thumbnail: String,
    email: String
  },
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String
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
