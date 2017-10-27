import { Observable } from 'rxjs';
import qs from 'querystring';
import { push, LOCATION_CHANGE } from 'react-router-redux';
import arrayEqual from 'app/utils/array-equal';
import getQueryFromLocation from 'app/utils/location-query';
import * as UserActions from 'app/actions/user';

function getUsersFromQuery( query ) {
	if ( query.user ) {
		if ( Array.isArray( query.user ) ) {
			return query.user;
		} else {
			return [ query.user ];
		}
	}

	return [];
}

function getUsersFromLocation( location ) {
	return getUsersFromQuery( getQueryFromLocation( location ) );
}

export const pushUsersToLocation = ( action$, store ) => (
	action$.ofType( 'USERS_UPDATE' )
		// If there are no users and no search query, no action needs to be taken.
		.filter( ( action ) => !arrayEqual( getUsersFromLocation( store.getState().router.location ), action.users ) )
		.flatMap( ( action ) => {
			let location = store.getState().router.location;
			let query = getQueryFromLocation( location );

			query = {
				...query,
				user: [
					...action.users
				]
			};

			location = {
				...location,
				search: '?' + qs.stringify( query )
			};

			return Observable.of( push( location ) );
		} )
);

export const pushLocationToUsers = ( action$, store ) => (
	action$.ofType( LOCATION_CHANGE )
		// If there are no users and no search query, no action needs to be taken.
		.filter( () => !arrayEqual( getUsersFromLocation( store.getState().router.location ), store.getState().users ) )
		.flatMap( () => Observable.of( UserActions.updateUsers( getUsersFromLocation( store.getState().router.location ) ) ) )
);
