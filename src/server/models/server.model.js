var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/*
// pre Sub-Document , Storing variation betwwen two consecutive points.
var Signature = {
	deltaX: [Number],
	deltaY: [Number]
};
// Normailzation parameters， keep them in permanent storage so that avoid recalculateing when do verification.
var NormalizeBase = {
		distanceAverageMin: Number,
		distanceAverageMax: Number,
		distanceAverage_AverageMin: Number,
		RefTemplateIndex: Number

};
// This Schema store user information, for now, include username, email and a set of signature. 
var UserSchema = new Schema({
	Username: String,
	Email: String,
	//CreatedTime: Date,
	NormalizeBase: NormalizeBase,	
	SigSet: [Signature]
});
*/
// This Schema store user information, for now, include username, email and a set of signature. 
var EncryptedUserSchema = new Schema({
	Username: String,
	Email: String, // We will use this email address for user validation. i.e, when Username and Email are matched, it becomes a valid user access.
	Data: String
});


var EncryptedUserSigs = mongoose.model('EncryptedUser', EncryptedUserSchema);


//export model
module.exports = {			
	EncryptedUserSigs: EncryptedUserSigs
}