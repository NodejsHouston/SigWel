// API routes
var vector ={agent: "myagent"};
vector.init = function(data,fn){
        var err;
        if(data<5){
            err = false;
            data=10;
        }
        else err=true;

        if (fn(err,data))
            return this;
        else return false;
};

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
            path: apiBase + '/user/{username}',
            config:{
                handler: function(request,reply){
                    var i,initSigCollection;
                    initSigCollection= new Array();
                    //var UninitSigCollection = request.payload.data;
                    var UninitSigCollection=[1,2,3,4,6,4];
                    var isOK = UninitSigCollection.every(function(sig){
                        return vector.init(sig, function(err,initsig){
                            if (err) {
                                console.log("init failed");
                               // reply("init failed");
                                return false;
                            }
                            else {
                                initSigCollection.push(initsig);
                                return true;
                            }
                        });
                       
                    });
                    if (isOK) reply("that is good");
                    else reply("init failed HAHAHA");
                    console.log(initSigCollection);
                    
                    var username= request.payload.username;
                    console.log(username);
                    //console.log(data);

                },
                id: 'tuser'
            }
        }
    ]);

    next();
}

exports.register.attributes = {
    name: 'api'
};