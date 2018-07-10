import Query from 'app/entities/query';
import locationQuery from './location-query';

test( 'will return a Query object', () => {
	const wiki = 'testwiki';
	const location = {
		search: `?wiki=${wiki}`
	};

	let query;

	query = locationQuery( location );
	expect( query ).toBeInstanceOf( Query );
	expect( query.wiki ).toEqual( wiki );

	query = locationQuery( {} );
	expect( query ).toBeInstanceOf( Query );
	expect( query.wiki ).toEqual( undefined );
} );
