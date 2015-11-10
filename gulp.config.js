module.exports = function() {
	var serverDir = './src/';
	
	var config = {
		nodeServer: {
			build: './dist/server.js',
			dev: 'server.js'
		},
		server: serverDir,
		defaultPort: 3000
	};
	
	return config;
}
