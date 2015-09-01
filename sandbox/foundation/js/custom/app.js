var crypto = require('./encdec.js')
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var enc = new crypto();
var msg = "Hello Ilmo";
var msg1 = enc.Encrypt(msg);
var msg2 = enc.Decrypt(msg1);
console.log(msg + " --> " + msg1 + " --> " + msg2);
// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/ilmodb';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
	if (err) {
	console.log('Unable to connect to the mongoDB server. Error:', err);
	} else {
		console.log('Connection established to', url);
		var collection = db.collection('users');
		var data = {};
		data.name = 'ilmoData';
		data.sig = {deltaX:[12,34,56,78,90], deltaY: [-1,2,-1,2,3,4], Email: 'xyz@abc.com'};
		var name = 'ilmo3';
		var pkg = {name: name, data: enc.Encrypt(data)};
		collection.insert(pkg, function(err, result) {
			if(err){
				console.log(err);
			}else {
				console.log('Inserted');
			}
			db.close();
		});
	}
});

MongoClient.connect(url, function(err, db){
	if(err) {
		console.log('2nd db connection failure', err);
	} else {
		console.log('2nd conn is okay.');
		var collection = db.collection('users');
		collection.find({name: 'ilmo3'}).limit(3).toArray(function (err, result) {
			if(err) {
				console.log('Query failure',  err);
			} else if(result.length) {
				console.log('Found.');
				for(var i = 0; i < result.length; i++) {
					console.log(result[i].name);
					console.log(enc.Decrypt(result[i].data));
				}
			}
		});
	}
});
	
				







