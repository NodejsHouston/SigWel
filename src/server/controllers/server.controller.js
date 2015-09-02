var user = require('../models/server.model.js').EncryptedUserSigs;

var encdec = require('../lib/encdec.js')
var crypto = new encdec();


//DB write operation,create a new user and associated signature set. 
exports.CreateUser = function (request,reply,data){
	// Any additional data will be encapsulated in this payload.
	var payload = {		
		SigSet: data.Sigs,
		NormalizeBase: data.NormalizeBase};

	var newuser = new user({
		Username: data.Username,
		Email: crypto.Encrypt(data.Email),
		Data: crypto.Encrypt(payload)		

	});
	newuser.save(function(err){
		if (err) {
			console.log(err);
			reply({type:false, message: "Failed to save user information..." });
		}
		else {
			reply({type:true, message: "Save user information successfully!"});
		}
	});
};

//DB read operation, read certain user's information from DB and send back to client	

exports.FindUser = function(request,reply,data,fn){	
	var email = crypto.Encrypt(data.Email);
	var query = user.findOne({Username: data.Username, Email: email});	
	
	query.exec(function(err,result){
		if(err) {
			reply({type:false, message:"Cannot read this user's information."});
		}
		var re = null;
		if(result) {
			var payload = crypto.Decrypt(result.Data);
			re = {};
			re.Email = crypto.Decrypt(result.Email);
			re.NormalizeBase = payload.NormalizeBase;
			re.SigSet = payload.SigSet;			
		}		
		fn(re);

	});
};	
