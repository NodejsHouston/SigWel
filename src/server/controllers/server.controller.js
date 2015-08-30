var user = require('../models/server.model.js').UserSigs;
var encdec = require('../lib/encdec.js')
var crypto = new encdec();


//DB write operation,create a new user and associated signature set. 
exports.CreateUser = function (request,reply,data){
	var newuser = new user({
		Username: data.Username,
		Email: crypto.Encrypt(data.Email),
		SigSet: crypto.Encrypt(JSON.stringify(data.Sigs)),
		NormalizeBase: data.NormalizeBase
	});
	newuser.save(function(err){
		
		if (err)
			reply({type:false, message: "Failed to save user information..."});
		console.log("win");
		reply({type:true, message: "Save user information successfully!"});
	});
};

//DB read operation, read certain user's information from DB and send back to client
exports.FindUser = function(request,reply,data,fn){
	var query = user.findOne({Username: data.Username, Email:crypto.Encrypt(data.Email)});
	//var results;
	query.exec(function(err,results){
		if(err){
			console.log('error reading');
			reply({type:false, message:"Cannot read this user's information."});
		}
		result.Email = crypto.Decrypt(result.Email);
		result.SigSet = crypto.Decrypt(JSON.parse(result.SigSet));
		fn(results);
		
	});
	//console.log("huhu");
	/*query.sort({username: 'desc'})
		.exec(function(err,results){
			reply(results);
		});*/
	
};	
