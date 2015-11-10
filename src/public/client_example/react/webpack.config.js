var webpack = require('webpack'),
	path = require('path');

var HtmlwebpackPlugin = require('html-webpack-plugin');

module.exports ={
	entry: './app/index.js',
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'index_bundles.js'
	},

	plugins: [
		new HtmlwebpackPlugin({
			title: 'blog'
		})
	],

	module: {
		loaders:[
			{
				test: /\.css$/,
        		loaders: ['style', 'css']
        		//include: APP_PATH
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loaders: ["react-hot","babel"]
			}
		]
	}

}