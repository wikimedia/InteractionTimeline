import { Observable } from 'rxjs';
import qs from 'querystring';
import { Set } from 'immutable';
import { replace, LOCATION_CHANGE } from 'react-router-redux';
import getQueryFromLocation from 'app/utils/location-query';
import * as QueryActions from 'app/actions/query';

function getUsersFromQuery( query ) {
	if ( query.user ) {
		if ( Array.isArray( query.user ) ) {
			return new Set( query.user );
		} else {
			return new Set( [ query.user ] );
		}
	}

	return new Set();
}

function getUsersFromLocation( location ) {
	return getUsersFromQuery( getQueryFromLocation( location ) );
}

export const pushUsersToLocation = ( action$, store ) => (
	action$.ofType( 'USERS_UPDATE' )
		// If there are no users and no search query, no action needs to be taken.
		.filter( ( action ) => !getUsersFromLocation( store.getState().router.location ).equals( action.users.toArray() ) )
		.flatMap( ( action ) => {
			let location = store.getState().router.location;
			let query = getQueryFromLocation( location );

			query = {
				...query,
				user: [
					...action.users.toArray()
				]
			};

			location = {
				...location,
				search: '?' + qs.stringify( query )
			};

			return Observable.of( replace( location ) );
		} )
);

export const pushLocationToUsers = ( action$, store ) => (
	action$.ofType( LOCATION_CHANGE )
		// If there are no users and no search query, no action needs to be taken.
		.filter( () => !getUsersFromLocation( store.getState().router.location ).equals( store.getState().query.user ) )
		.flatMap( () => Observable.of( QueryActions.setQueryValue( 'user', getUsersFromLocation( store.getState().router.location ) ) ) )
);
