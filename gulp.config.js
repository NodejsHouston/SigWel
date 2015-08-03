module.exports = function() {
	var serverDir = './src/server/';
	
	var config = {
		nodeServer: {
			build: './dist/server.js',
			dev: serverDir + 'server.js'
		},
		server: serverDir
	};
	
	return config;
}