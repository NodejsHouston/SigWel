var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// This Schema store user information, for now, include username, email and a set of signature. 
var EncryptedUserSchema = new Schema({
	Username: String,
	Email: String, // We will use this email address for user validation. i.e, when Username and Email are matched, it becomes a valid user access.
	Data: String
});


var EncryptedUserSigs = mongoose.model('EncryptedUser', EncryptedUserSchema);

var ApiUserSchema = new Schema({
	Username: String,
	Password: String,
	Email: String,
	WebDomain: String,
	UserLevel: Number,
	Apikeys: [String]
});

var ApiUser = mongoose.model('ApiUser',ApiUserSchema);

//export model
module.exports = {			
	EncryptedUserSigs: EncryptedUserSigs,
	ApiUser: ApiUser
}