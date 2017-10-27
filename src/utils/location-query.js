import qs from 'querystring';

export default ( location ) => {
	let query = {};

	if ( location.search ) {
		query = qs.parse( location.search.substring( 1 ) );
	}

	return query;
};
