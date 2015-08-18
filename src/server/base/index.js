// Base routes for default index/root path, about page, 404 error pages, and others..
exports.register = function (server, options, next) {

    server.route([
        {
            method: 'GET',
            path: '/register',
            config: {
                handler: function (request, reply) {
                    reply.view('register', {
                        title: 'Register'
                    });
                },
                id: 'register'
            }
        },
        {
            method: 'GET',
            path: '/',
            config: {
                handler: function (request, reply) {
                    // Render the view with the custom greeting
                    reply.view('index', {
                        title: 'SigWel'
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