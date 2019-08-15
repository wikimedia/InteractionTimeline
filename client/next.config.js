/* eslint-env node */
const withSass = require( '@zeit/next-sass' );
const withCSS = require( '@zeit/next-css' );

module.exports = withCSS( withSass( {
	webpack: ( config ) => {
		config.module.rules.push( {
			test: /\.(png|svg|eot|otf|ttf|woff|woff2)$/,
			use: {
				loader: 'file-loader',
				options: {
					limit: 100000,
					publicPath: './',
					outputPath: 'static/',
					name: '[name].[ext]',
				},
			},
		} );

		return config;
	},
} ) );
