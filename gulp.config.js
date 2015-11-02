module.exports = function() {
	var serverDir = './src/';
	
	var config = {
		nodeServer: {
			build: './dist/server.js',
			dev: 'server.js'
		},
		server: serverDir
	};
	
	return config;
}
