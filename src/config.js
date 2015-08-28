var fs = require('fs');
var config=
{
	host: 'localhost',
    http: { port: 8000 },
    https: { 
        port: 8080, 
        key: fs.readFileSync('./src/server/key.pem'), 
        cert: fs.readFileSync('./src/server/key-cert.pem') 
    },
    db: {connection: 'mongodb://sigwel:NhSwDb@ds029803.mongolab.com:29803/sigweldb'}
}

module.exports = config;