var user = require('../models/server.model.js').UserSigs;
var encdec = require('../lib/encdec.js')
var crypto = new encdec();


//DB write operation,create a new user and associated signature set. 
exports.CreateUser = function (request,reply,data){
	var newuser = new user({
		Username: data.Username,
		Email: crypto.Encrypt(data.Email),
		SigSet: data.Sigs,
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
	var query = user.findOne({Username: data.Username, Email:crypto.Encrypt(data.Email)},{'SigSet._id': false});
	//var results;
	query.exec(function(err,results){
		if(err){
			console.log('error reading');
			reply({type:false, message:"Cannot read this user's information."});
		}
		if(results){
		results.Email = crypto.Decrypt(results.Email);	
		//results.SigSet = crypto.Decrypt(JSON.parse(results.SigSet));
		}
		
		fn(results);
		
	});
	//console.log("huhu");
	/*query.sort({username: 'desc'})
		.exec(function(err,results){
			reply(results);
		});*/
	
};	
