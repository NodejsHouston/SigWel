module.exports = function() {
	var serverDir = './src/';
	
	var config = {
		nodeServer: {
			build: './dist/server.js',
			dev: serverDir + 'server.js'
		},
		server: serverDir
	};
	
	return config;
}