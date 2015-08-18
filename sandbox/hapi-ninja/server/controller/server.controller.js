var user = require('../models/server.model.js').UserSigs;


//DB write operation,create a new user and associated signature set. 
exports.CreateUser = function (request,reply,data){
	var newuser = new user({
		Username: data.Username,
		SigSet: data.Sigs,
		NormalizeBase: data.NormalizeBase
	});
	newuser.save(function(){
		reply("finish write operation");
	});

};

//DB read operation, read all users' information from DB and send back to client
exports.FindUser = function(request,reply,data,fn){
	var query = user.findOne({Username: data.Username});
	var results;
	query.exec(function(err,results){
		fn(results);
		//console.log(data.profile);
	});
	
	
	//console.log("huhu");
	/*query.sort({username: 'desc'})
		.exec(function(err,results){
			reply(results);
		});*/
	
};	
