

var vector=require('../lib/vector');
var util=require('../lib/util');
var UserCtrl = require('../controller/server.controller.js');

exports.register = function(server, options, next){

    var apiBase = '/api';

    server.route([
        {
            method: 'GET',
            path: apiBase + '/blah',
            config: {
                handler: function(request, reply){
                    reply({
                        message: 'blah test'
                    })
                },
                id: 'blah'
            }
        },
         {
            method:'POST',
            path: apiBase + '/user/ref/{username}',
            config:{
                handler: function(request,reply){
                    var i,initSigCollection;
                    initSigCollection= new Array();
                    //var UninitSigCollection = request.payload.data;
                   // var UninitSigCollection=[[[1,2,3,3,3],[4,6,4,4,4]],[[5,6,7,2],[2,3,4,2]],[[3,2,7,4],[5,3,2,8]]];
                    var TempArray = request.payload.data;

                    var UninitSigCollection = new Array();

                    for(i = 0; i<TempArray.length;i++){
                        UninitSigCollection.push(new Array());
                        UninitSigCollection[i].push(TempArray[i].TrackX);
                        UninitSigCollection[i].push(TempArray[i].TrackY);
                    }                    
                    var isOK = UninitSigCollection.every(function(sig){
                        var v= new vector(sig);
                       /* return v.deduplication(function(err,initsig){
                            if (err) {
                                console.log("init failed");
                               // reply("init failed");
                                return false;
                            }
                            else {
                                initSigCollection.push(initsig);
                                return true;
                            }
                        });*/
                       if(v.Deduplication().CompareDelta().GetErr()){
                        reply(v.GetErr());
                        return false;
                        }
                        else{
                            initSigCollection.push(v.GetValue());
                        }
                        return true;

                    });
                    //if (isOK) reply("that is good!!");
                    //console.log(vector.DWT(initSigCollection[0],initSigCollection[1]));
                    console.log(initSigCollection);
                    var data={};
                    data.Sigs= new Array();
                    data.NormalizeBase= util.GetNormalize(initSigCollection,vector.DWT);
                    data.Username=request.payload.username;
                    for(i=0;i<initSigCollection.length;i++){
                        data.Sigs.push({deltaX:initSigCollection[i][0],deltaY:initSigCollection[i][1]});
                    }
                    UserCtrl.CreateUser(request,reply,data);
                    //console.log(username);
                    //console.log(data);

                },
                id: 'userref'
            }
        },
        {
            method:"POST",
            path:apiBase +'/user/test/{username}',
            config:{
                handler: function(request,reply){
                    var i, RefSigCollection;
                    var data = {};
                    data.Username= request.payload.username;
                    console.log(data.Username);
                    var testArray = request.payload.data;
                    var testSig = new Array();
                    testSig.push(testArray.TrackX);
                    testSig.push(testArray.TrackY);
                    testSig= new vector(testSig);
                    if(testSig.Deduplication().CompareDelta().GetErr())
                        reply(v.GetErr());
                    else{
                    UserCtrl.FindUser(request,reply,data,function(RefSigSet){
                       var refsigset= new Array();
                       for(i=0; i<RefSigSet.SigSet.length; i++){
                        refsigset.push(new Array());
                        refsigset[i].push(RefSigSet.SigSet[i].deltaX);
                        refsigset[i].push(RefSigSet.SigSet[i].deltaY);
                       } 
                       var Similarity= util.OneToCollection(testSig.GetValue(),refsigset,RefSigSet.NormalizeBase,vector.DWT);
                       console.log(Similarity);
                       reply(Similarity);

                    });
                }
                    
                    


                },        

                id: 'usertest'
            }
            
        }
    ]);

    next();
}

exports.register.attributes = {
    name: 'api'
};