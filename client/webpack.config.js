/* eslint-env node */
const path = require( 'path' );
const webpack = require( 'webpack' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const UglifyJSPlugin = require( 'uglifyjs-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const ScriptExtHtmlWebpackPlugin = require( 'script-ext-html-webpack-plugin' );
const FaviconsWebpackPlugin = require( 'favicons-webpack-plugin' );

const publicPath = process.env.NODE_ENV === 'production' ? '/interaction-timeline/' : '/';

const extractSass = new ExtractTextPlugin( {
	filename: 'styles/[name].css',
	disable: process.env.NODE_ENV !== 'production'
} );

const config = {
	entry: './index.js',
	output: {
		filename: 'scripts/[name].js',
		path: path.resolve( __dirname, '../html' ),
		publicPath
	},
	devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'cheap-module-source-map',
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
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: './images/'
						}
					}
				]
			},
			{
				test: /\.(eot|woff2|woff|ttf)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: './fonts/'
						}
					}
				]
			}
		]
	},
	plugins: [
		extractSass,
		new FaviconsWebpackPlugin( path.resolve( './images/logo.png' ) ),
		new CleanWebpackPlugin( [ '../html' ], {
			exclude: [ 'api' ],
			allowExternal: true
		} ),
		new webpack.DefinePlugin( {
			APP_ENV: JSON.stringify( process.env.APP_ENV ),
			// @see https://facebook.github.io/react/docs/optimizing-performance.html#webpack
			'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV ),
			'process.env.PUBLIC_PATH': JSON.stringify( publicPath )
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
