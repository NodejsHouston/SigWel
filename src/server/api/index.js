// API routes


var apiHandler = require('./apiHandler');
var uuid = require('uuid');

exports.register = function(server, options, next) {

    var apiBase = '/api';

    server.route([{
            method: 'GET',
            path: apiBase + '/blah',
            config: {
                
                handler: function(request, reply) {
                    reply({
                        message: 'blah test'
                    })
                },
                id: 'blah'
            }
        }, {
            //This post method regulate vector array from client-side and create a new user based on new array, 
            //storing associated information including reference signatures' vectors 
            method: 'POST',
            path: apiBase + '/user/ref/{username}',
            config: {
              
                handler: apiHandler.PostRef,
                id: 'userref'
            }
        }, {
            //This post method read certain user's reference signature 
            //and compare them with test signature, return the similarity 
            //and verification status to client
            method: "POST",
            path: apiBase + '/user/test/{username}',
            config: {
    
                handler: apiHandler.CompareTest,
                id: 'usertest'
            }

        }

       

    ]);

    next();
}

exports.register.attributes = {
    name: 'api'
};