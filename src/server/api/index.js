// API routes
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
        }
    ]);

    next();
}

exports.register.attributes = {
    name: 'api'
};