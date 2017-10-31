import qs from 'querystring';
import Query from 'app/entities/query';

export default ( location ) => {
	let data = {};

	if ( location.search ) {
		data = qs.parse( location.search.substring( 1 ) );
	}

	return new Query( data );
};
