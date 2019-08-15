import { OrderedSet, Record } from 'immutable';
import { isIPv6Address } from 'app/utils/ip-validator';

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
			} else {
				user = new OrderedSet( [ data.user ] );
			}

			// we need to uppercase IPv6 addresses to match
			// what's returned by the the usercontribs api endpoint
			user = user.map( ( value ) => {
				return isIPv6Address( value ) ? value.toUpperCase() : value;
			} );
		}

		super( {
			...data,
			user
		} );
	}

}
