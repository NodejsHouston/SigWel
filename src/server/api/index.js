// API routes
exports.register = function(server, options, next){

    var apiBase = '/api';

    server.route([
        {
            method: 'GET',
            path: apiBase + '/blah',
            config: {
                handler: function(request,reply){
                    reply({
                        message: 'blah test'
                    })
                },
                id: 'blah'
            }
        },
        
        /*{
            method:'POST',
            path: apiBase + '/user',
            config:{
                handler: function(request,reply){
                    var data = request.payload.data;
                    console.log(data);
                },
                id: 'tuser'
            }
        }*/
    ]);

    next();
}

exports.register.attributes = {
    name: 'api'
};