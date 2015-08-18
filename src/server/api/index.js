// API routes
exports.register = function(server, options, next){

    var apiBase = '/api';

    server.route([
        {
            method: 'GET',
            path: apiBase + '/{filename*}',
            config: {
                handler: function(request, reply){
                    reply.file(__dirname + '/' + request.params.filename + '.json')
                }
            }
        }
    ]);

    next();
}

exports.register.attributes = {
    name: 'api'
};