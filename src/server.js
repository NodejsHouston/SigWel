/**
* Dependencies.
*/
var Hapi = require('hapi');
//Load Mongo driver...
var mongoose = require('mongoose');
// Create a new server
var server = new Hapi.Server();

//Connect to MongoDBLab instance...
mongoose.connect("mongodb://sigwel:NhSwDb@ds029803.mongolab.com:29803/sigweldb");

// Setup the server with a host and port
server.connection({
    port: parseInt(process.env.PORT, 10) || 3000,
    host: 'localhost'
});

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
        options: require('./assets.js')
    },
    {
        register: require("hapi-named-routes")
    },
    {
        register: require("hapi-cache-buster")
    },
    {
        register: require('./server/assets/index.js')
    },
    {
        register: require('./server/base/index.js')
    },
    {
        register: require('./server/api/index.js')
    }
], function () {
    //Start the server
    server.start(function () {
        //Log to the console the host and port info
        console.log('Server started at: ' + server.info.uri);
    });
});
