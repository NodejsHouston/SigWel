var user = require('../models/server.model.js').EncryptedUserSigs;
var ApiUser = require('../models/server.model.js').ApiUser;

var encdec = require('../lib/encdec.js')
var crypto = new encdec();


exports.CreateApiUser = function(request,reply,fn){
	var data = request.payload;
	console.log(data);
	var newApiUser = new ApiUser({
	Username: data.Username,
	Password: crypto.Encrypt(data.Password),
	Email: crypto.Encrypt(data.Email),
	WebDomain: data.WebDomain || '',
	UserLevel: data.UserLevel || 1,
	});

	newApiUser.save(function(err){
		if(err){
			console.log(err);
			reply({type:false, message:"Failed to Create User..."});
		}
		else{
			console.log("Saved user");
			reply({type:true, message:"Save your information successfully"});
		}

	});
};

exports.ValidateApiUser = function(request,reply,fn){
	var query = ApiUser.findOne({
		Username: request.payload.Username,
		Password: crypto.Encrypt(request.payload.Password)
	});

	query.exec(function(err,result){
		if(err){
			console.log("error read");
			reply({type:false, message: "read error occur!"});
		}
		
		if(result){
			result.Email= crypto.Decrypt(result.Email);
			
			fn(result);
		}
		else{
			reply({type:false, message: "User doesn't Exist!"})
		}
	});
}


//DB write operation,create a new user and associated signature set. 
exports.CreateUser = function(request, reply, data) {
	// Any additional data will be encapsulated in this payload.
	var payload = {
		SigSet: data.Sigs,
		NormalizeBase: data.NormalizeBase
	};

	var newuser = new user({
		Username: data.Username,
		Email: crypto.Encrypt(data.Email),
		Data: crypto.Encrypt(payload)

	});
	newuser.save(function(err) {
		if (err) {
			console.log(err);
			reply({
				type: false,
				message: "Failed to save user information..."
			});
		} else {
			reply({
				type: true,
				message: "Save user information successfully!"
			});
		}
	});
};

//DB read operation, read certain user's information from DB and send back to client	

exports.FindUser = function(request, reply, data, fn) {
	var email = crypto.Encrypt(data.Email);
	var query = user.findOne({
		Username: data.Username,
		Email: email
	});

	query.exec(function(err, result) {
		if (err) {
			reply({
				type: false,
				message: "Cannot read this user's information."
			});
		}
		var re = null;
		if (result) {
			var payload = crypto.Decrypt(result.Data);
			re = {};
			re.Email = crypto.Decrypt(result.Email);
			re.NormalizeBase = payload.NormalizeBase;
			re.SigSet = payload.SigSet;
		}
		fn(re);

	});
};