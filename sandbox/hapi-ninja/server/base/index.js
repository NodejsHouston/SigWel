// Base routes for default index/root path, about page, 404 error pages, and others..
var UserCtrl = require('../controller/server.controller.js');
exports.register = function (server, options, next) {

    server.route([




        {
            method: 'GET',
            path: '/foundation',
            config: {
                handler: function (request, reply) {
                    reply.view('foundation', {
                        title: 'test'
                    });
                },
                id: 'foundation'
            }
        },

        //A temporary Get methods (for browser easy test) to test write operation 
        //and verify if the model is correct.
        {
            method: 'GET',
            path:'/PostArray/{user}',
            config:{ 
                handler: function(request, reply) {
                    var i,j;
                    var data={};
                    
                    //Test data
                    var pointX= [1,2,3,4];
                    var pointY= [5,6,7,8];
                    data.sigs = new Array();
                    //Construct data object
                    for(j=0;j<5;j++){
                        data.sigs.push({deltax:pointX,deltay:pointY});
                        }
                    //using URL param "user" to determine username
                    data.username=request.params.user;
                
                    //Pass data to model's write operation.
                    UserCtrl.create(request,reply,data);
                    //Send response to user after finish writing
                    
                },
                id: 'PostArray'
            }
        },

        //a temporary GET methods to retrieve all users' information stored in DB
        {
            method: 'GET',
            path:'/GetArray',
            config:{
                handler: function(request,reply){
                    UserCtrl.list(request,reply);
                    
                },
                id: 'GetArray'
            } 
        },

        {
            method: 'GET',
            path: '/about',
            config: {
                handler: function (request, reply) {
                    reply.view('about', {
                        title: 'Super Informative About Page'
                    });
                },
                id: 'about'
            }
        },
        {
            method: 'GET',
            path: '/',
            config: {
                handler: function (request, reply) {
                    // Render the view with the custom greeting
                    reply.view('index2', {
                        
                    });
                },
                id: 'index'
            }
        },
        {
            method: 'GET',
            path: '/{path*}',
            config: {
                handler: function (request, reply) {
                    reply.view('404', {
                        title: 'Total Bummer 404 Page'
                    }).code(404);
                },
                id: '404'
            }
        }
    ]);

    next();
}

exports.register.attributes = {
    name: 'base'
};