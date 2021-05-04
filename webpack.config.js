const path = require('path')

module.exports = {
	entry: {
		app: './assets/js/canvas.js'
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, '/dist'),
		publicPath: '/dist'
	},
	module: {
		rules: [{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: '/node_modules/'
		}]
	},
	devServer: {
		overlay: true,
    port: 5005
	}
}