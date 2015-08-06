var mongoose= require('mongoose');
var Schema = mongoose.Schema;
// pre Sub-Document , Storing variation betwwen two consecutive points.
var Signature ={
	deltax: [Number],
	deltay: [Number]
};

// This Schema store user information, for now, include username and a set of signature 
var UserSchema = new Schema({
	username: String,
	SigSet: [Signature] 
});


var UserSigs = mongoose.model('User',UserSchema);


//export model
module.exports={
	UserSigs: UserSigs
}	




