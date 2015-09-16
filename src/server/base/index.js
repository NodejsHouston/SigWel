// Base routes for default index/root path, about page, 404 error pages, and others..

var dbController = require('../controllers/server.controller.js');
exports.register = function(server, options, next) {

    server.route([{
            method: 'GET',
            path: '/login',
            config: {
                auth:{
                    mode: 'try',
                    strategy: 'session'
                },
                plugins:{'hapi-auth-cookie':{redirectTo:false}},
                handler: function(request, reply) {
                    //if(request.auth.isAuthenticated){
                    //console.log(request.auth.isAuthenticated);
                    //}
                    reply.view('login', {
                        title: 'Login',
                        credentials: request.auth.credentials
                        
                    });
                },
                id: 'login'
            }
        },


        {
            method: 'GET',
            path: '/logout',
            config: {
               
                auth:'session',

                handler: function(request, reply) {
                    //console.log("go into login api");
                   request.auth.session.clear();
                   return reply.redirect('/');
                },
                id: 'logout'
            }
        },

        {
            method: 'POST',
            path: '/login',
            config: {
               
                auth:{
                    mode: 'try',
                    strategy: 'session'
                },
                plugins:{'hapi-auth-cookie':{redirectTo:false}},

                handler: function(request, reply) {
                    //console.log("go into login api");
                   
                    dbController.ValidateApiUser(request,reply,function(user){
                        //console.log(user);
                        request.auth.session.set(user);
                        return reply({redirect:'/profile'});

                    });



                },
                id: 'login_post'
            }
        },

        {
            method: 'GET',
            path: '/register',
            config: {
                
                handler: function(request, reply) {
                    console.log('reg'+request.auth.isAuthenticated);
                    //console.log(request.auth.credentials);
                    reply.view('register', {
                        title: 'Register',
                        credentials:request.auth.credentials
                    });
                },
                id: 'register'
            }
        },

        {
            method: 'POST',
            path: '/register',
            config: {

                handler: function(request, reply) {
                    //console.log("go into api");
                    //console.log(request.payload.data);
                    dbController.CreateApiUser(request, reply);
                    request.auth.session.set(request.payload);
                    return reply({redirect:'/profile'});

                   

                },
                id: 'register_post'
            }
        },

        {
            method: 'GET',
            path: '/profile',
            config: {
                auth:'session',
                handler: function(request, reply) {
                    console.log('reg'+request.auth.isAuthenticated);
                    //console.log(request.auth.credentials);
                    reply.view('profile', {
                        title: 'Profile',
                        credentials:request.auth.credentials
                    });
                },
                id: 'profile'
            }
        },

        {
            method: 'GET',
            path: '/',
            config: {
                auth:{
                    mode: 'try',
                    strategy: 'session'
                },
                plugins:{'hapi-auth-cookie':{redirectTo:false}}, 
                handler: function(request, reply) {
                    // Render the view with the custom greeting
                    reply.view('index', {
                        title: 'SigWel',
                        credentials:request.auth.credentials
                    });
                },
                id: 'index'
            }
        }, {
            method: 'GET',
            path: '/{path*}',
            config: {
                handler: function(request, reply) {
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