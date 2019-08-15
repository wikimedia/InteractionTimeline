const { basename } = require( 'path' );

// Get all of the JSON files.
const context = require.context( '../../i18n', true, /\.json$/ );

// Convert the list of files to an object.
const messages = context.keys().reduce( ( acc, key ) => {
	const locale = basename( key, '.json' );

	return {
		...acc,
		[ locale ]: context( key ),
	};
}, {} );

export default messages;
