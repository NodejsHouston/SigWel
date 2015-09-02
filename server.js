/**
* Dependencies.
*/
var Hapi = require('hapi');
//Load Mongo driver...
var mongoose = require('mongoose');

var config = require('./src/config');
// Create a new server


var server = new Hapi.Server();

//Connect to MongoDBLab instance...
mongoose.connect(config.db.connection);

// Setup the server with a host and port
server.connection({
    port: parseInt(process.env.PORT, 10) || config.http.port,
    host: '0.0.0.0',
    
    // tls: {
    //     key: config.https.key,
    //     cert: config.https.cert
    }
);

if(process.env.NODE_ENV="production"){
 server.ext('onRequest', function (request, reply) {

   if (request.headers['x-forwarded-proto'] === 'http') {
   
      return reply.code(400);
    
    }
   reply.continue();
});
}
// Setup the views engine and folder
server.views({
    engines: {
        html: require('swig')
    },
    path: './src/server/views'
});

// Export the server to be required elsewhere.
module.exports = server;

/*
    Load all plugins and then start the server.
    First: community/npm plugins are loaded
    Second: project specific plugins are loaded
 */
server.register([
    // {
    //     register: require("good"),
    //     options: {
    //         opsInterval: 5000,
    //         reporters: [{
    //             reporter: require('good-console'),
    //             args: [{ ops: '*', request: '*', log: '*', response: '*', 'error': '*' }]
    //         }]
    //     }
    // },
    {
        register: require("hapi-assets"),
        options: require('./src/assets.js')
    },
    {
        register: require("hapi-named-routes")
    },
    {
        register: require("hapi-cache-buster")
    },
    {
        register: require('./src/server/assets/index.js')
    },
    // {
    //     register: require('./src/server/api/preRequest.js')
    // },
    {
        register: require('./src/server/base/index.js')
    },

    {
        register: require('./src/server/api/index.js')
    }
], function () {
    //Start the server
    server.start(function () {
        //Log to the console the host and port info
        console.log('Server started at: ' + server.info.uri);
    });
});
