/* eslint-env node */
const withSass = require( '@zeit/next-sass' );
const withCSS = require( '@zeit/next-css' );

module.exports = withCSS( withSass( {
	webpack: ( config, { isServer } ) => {
		config.module.rules.push( {
			test: /\.(png|svg|eot|otf|ttf|woff|woff2)$/,
			use: {
				loader: 'file-loader',
				options: {
					publicPath: '/_next/static/files/',
              		outputPath: `${isServer ? '../' : ''}static/files/`,
              		name: '[name]-[hash].[ext]',
				},
			},
		} );

		return config;
	},
} ) );
