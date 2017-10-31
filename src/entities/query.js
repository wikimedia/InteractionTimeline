import { Set, Record } from 'immutable';

export default class Query extends Record( {
	wiki: undefined,
	user: new Set(),
	startDate: undefined,
	endDate: undefined
}, 'Query' ) {

	constructor( data = {} ) {
		let user = new Set();

		if ( data.user ) {
			if ( Array.isArray( data.user ) ) {
				user = new Set( data.user );
			} else if ( typeof data.user === 'string' || data.user instanceof String ) {
				user = new Set( [ data.user ] );
			} else {
				user = data.user;
			}
		}

		super( {
			...data,
			user
		} );
	}

}
