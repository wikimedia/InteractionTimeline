/* eslint-env node */
require( 'dotenv' ).config();

const path = require( 'path' );
const webpack = require( 'webpack' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const UglifyJSPlugin = require( 'uglifyjs-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const ScriptExtHtmlWebpackPlugin = require( 'script-ext-html-webpack-plugin' );

const extractSass = new ExtractTextPlugin( {
	filename: 'styles/[name].css',
	disable: process.env.NODE_ENV !== 'production'
} );

const config = {
	entry: './index.js',
	output: {
		filename: 'scripts/[name].js',
		path: path.resolve( __dirname, 'html' ),
		publicPath: process.env.NODE_ENV === 'production' ? '/interaction-timeline/' : '/'
	},
	devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map',
	resolve: {
		alias: {
			app: path.resolve( './src' ),
			images: path.resolve( './images' )
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /i18n\.dir\.js$/,
				loader: 'dir-loader'
			},
			{
				test: /\.scss$|\.css$/,
				use: extractSass.extract( {
					use: [
						{
							loader: 'css-loader'
						},
						{
							loader: 'sass-loader'
						}
					],
					// use style-loader in development
					fallback: 'style-loader'
				} )
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: './images/'
						}
					}
				]
			}
		]
	},
	plugins: [
		extractSass,
		new CleanWebpackPlugin( [ './html' ] ),
		new webpack.DefinePlugin( {
			APP_ENV: JSON.stringify( process.env.APP_ENV ),
			// @see https://facebook.github.io/react/docs/optimizing-performance.html#webpack
			'process.env': {
				NODE_ENV: JSON.stringify( process.env.NODE_ENV )
			}
		} ),
		new HtmlWebpackPlugin( {
			title: 'Interaction Timeline',
			inject: 'head',
			template: './index.ejs',
			hash: true,
			xhtml: true
		} ),
		new ScriptExtHtmlWebpackPlugin( {
			defaultAttribute: 'async'
		} )
	]
};

if ( process.env.NODE_ENV === 'production' ) {
	config.plugins.push( new UglifyJSPlugin( {
		sourceMap: true
	} ) );
}

module.exports = config;
