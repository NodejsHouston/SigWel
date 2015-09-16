// These are the public assets. Goal is to serve css, js, partials, images, or bower packages.
exports.register = function (server, options, next) {

    server.route([
        {
            method: 'GET',
            path: '/partials/{path*}',
            config: {
                auth:false,
                handler: {
                    directory: { path: './src/server/views/partials' }
                },
                id: 'partials'
            }
        },
        {
            method: 'GET',
            path: '/images/{path*}',
            config: {
                auth:false,
                handler: {
                    directory: { path: './src/public/images' }
                },
                id: 'images'
            }
        },


        {
            method: 'GET',
            path: '/css/{path*}',
            config: {
                auth:false,
                handler: {
                    directory: { path: './src/public/css' }
                },
                id: 'css'
            }
        },
        {
            method: 'GET',
            path: '/js/{path*}',
            config: {
                auth:false,
                handler: {
                    directory: { path: './src/public/js' }
                },
                id: 'js'
            }
        },
        
        
        // {
        //     method: 'GET',
        //     path: '/css/{path*}',
        //     config: {
        //         handler: {
        //             directory: { path: './public/css' }
        //         },
        //         id: 'css'
        //     }
        // },
        // {
        //     method: 'GET',
        //     path: '/js/{path*}',
        //     config: {
        //         handler: {
        //             directory: { path: './public/js' }
        //         },
        //         id: 'js'
        //     }
        // },
        {
            method: 'GET',
            path: '/bower_components/{path*}',
            config: {
                auth:false,
                handler: {
                    directory: { path: './src/public/bower_components' }
                },
                id: 'bower'
            }
        }
    ]);

    next();
}

exports.register.attributes = {
    name: 'assets'
};