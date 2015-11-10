var vector = require('../lib/vector');
var util = require('../lib/util');
var UserCtrl = require('../controllers/server.controller.js');

module.exports = {
	PostRef: function(request, reply) {
		var authorization = request.raw.req.headers.authorization;
		console.log(authorization);
		var data = {};
		data.Username = request.payload.username;
		data.Email = request.payload.email;
		//TODO: using q or other promise library to replace callback
		UserCtrl.FindUser(request, reply, data, function(RefSigSet) {
			//if user has already exist!
			if (RefSigSet)
			//console.log(RefSigSet);
				reply({
				type: false,
				message: "User already exist!"
			});
			//create new user.
			else {
				var i, initSigCollection;
				initSigCollection = new Array();

				var TempArray = request.payload.data;

				var UninitSigCollection = new Array();

				for (i = 0; i < TempArray.length; i++) {
					UninitSigCollection.push(new Array());
					UninitSigCollection[i].push(TempArray[i].TrackX);
					UninitSigCollection[i].push(TempArray[i].TrackY);
				}
				var isOK = UninitSigCollection.every(function(sig) {
					var v = new vector(sig);

					//change input array
					if (v.Deduplication().CompareDelta().GetErr()) {
						reply(v.GetErr());
						return false;
					} else {
						initSigCollection.push(v.GetValue());
					}
					return true;

				});

				//console.log(initSigCollection);

				data.Sigs = new Array();
				data.NormalizeBase = util.GetNormalize(initSigCollection, vector.DWT);
				data.Username = request.payload.username;
				data.Email = request.payload.email;
				for (i = 0; i < initSigCollection.length; i++) {
					data.Sigs.push({
						deltaX: initSigCollection[i][0],
						deltaY: initSigCollection[i][1]
					});
				}
				//console.log("create it");
				UserCtrl.CreateUser(request, reply, data);
			}
		});
	},

	CompareTest: function(request, reply) {
		var i, RefSigCollection;
		var data = {};
		data.Username = request.payload.username;
		data.Email = request.payload.email;
		//console.log(data.Username);
		var testArray = request.payload.data;
		var testSig = new Array();
		testSig.push(testArray.TrackX);
		testSig.push(testArray.TrackY);
		testSig = new vector(testSig);
		if (testSig.Deduplication().CompareDelta().GetErr()) {
			//console.log(v.GetErr());
			reply({
				type: false,
				message: "System error!"
			});
		} else {
			UserCtrl.FindUser(request, reply, data, function(RefSigSet) {
				var refsigset = new Array();
				if (RefSigSet) {
					for (i = 0; i < RefSigSet.SigSet.length; i++) {
						refsigset.push(new Array());
						refsigset[i].push(RefSigSet.SigSet[i].deltaX);

						refsigset[i].push(RefSigSet.SigSet[i].deltaY);
						//console.log(RefSigSet.SigSet[i].deltaY);
					}
					var Similarity = util.OneToCollection(testSig.GetValue(), refsigset, RefSigSet.NormalizeBase, vector.DWT);
					//console.log(Similarity);
					var res = {};

					var simsum = Similarity.Min + Similarity.Max + Similarity.Template;
					//console.log(simsum);
					//res.message = 'similarity vector: ' + '[ Min:' + Similarity.Min.toFixed(2) + ' , ' + 'Max:' + Similarity.Max.toFixed(2) + ' , ' + 'Template:' + Similarity.Template.toFixed(2) + ']';
					res.Similarity = Similarity;
					res.type = (simsum > 2.5 && simsum < 3.75) ? true : false;


					//console.log(res.type);
					reply(res);
				} else {
					reply({
						type: false,
						message: "User doesn't exist!"
					});
				}

			});
		}


	}
}