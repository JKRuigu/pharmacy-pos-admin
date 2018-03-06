const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const adminSchema = new Schema({
  admins: {
    lname :String,
    fname: String,
		username: String,
  	password: String,
	}
});

adminSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}
adminSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.admins.password);
}


const Admin = mongoose.model('admin', adminSchema);
module.exports = Admin;
