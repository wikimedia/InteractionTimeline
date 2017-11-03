import { OrderedSet, Record } from 'immutable';

export default class Query extends Record( {
	wiki: undefined,
	user: new OrderedSet(),
	startDate: undefined,
	endDate: undefined
}, 'Query' ) {

	constructor( data = {} ) {
		let user = new OrderedSet();

		if ( data.user ) {
			if ( Array.isArray( data.user ) ) {
				user = new OrderedSet( data.user );
			} else if ( typeof data.user === 'string' || data.user instanceof String ) {
				user = new OrderedSet( [ data.user ] );
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
