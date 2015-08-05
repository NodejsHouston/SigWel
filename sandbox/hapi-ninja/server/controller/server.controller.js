var user = require('../models/server.model.js').UserSigs;


//DB write operation,create a new user and associated signature set. 
exports.create = function (request,reply,data){
	var newuser = new user({
		username: data.username,
		SigSet: data.sigs
	});
	newuser.save(function(){
		reply("finish write operation");
	});

};

//DB read operation, read all users' information from DB and send back to client
exports.list = function(request,reply){
	var query = user.find();
	//console.log("huhu");
	query.sort({username: 'desc'})
		.exec(function(err,results){
			reply(results);
		});
};	
