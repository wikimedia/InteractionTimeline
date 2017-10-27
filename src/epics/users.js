import { Observable } from 'rxjs';
import qs from 'querystring';
import { push, LOCATION_CHANGE } from 'react-router-redux';
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
	let query = {};

	if ( location.search ) {
		query = qs.parse( location.search.substring( 1 ) );
	}

	return getUsersFromQuery( query );
}

// @see https://stackoverflow.com/a/16436975/864374
function arraysEqual( a, b ) {
	if ( a === b ) {
		return true;
	}

	if ( a == null || b == null ) {
		return false;
	}

	if ( a.length !== b.length ) {
		return false;
	}

	// If you don't care about the order of the elements inside
	// the array, you should sort both arrays here.

	for ( let i = 0; i < a.length; ++i ) {
		if ( a[ i ] !== b[ i ] ) {
			return false;
		}
	}

	return true;
}

export const pushUsersToLocation = ( action$, store ) => (
	action$.ofType( 'USERS_UPDATE' )
		// If there are no users and no search query, no action needs to be taken.
		.filter( ( action ) => !arraysEqual( getUsersFromLocation( store.getState().router.location ), action.users ) )
		.flatMap( ( action ) => {
			let location = store.getState().router.location;
			let query = {};

			if ( location.search ) {
				query = qs.parse( location.search.substring( 1 ) );
			}

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
		.filter( () => !arraysEqual( getUsersFromLocation( store.getState().router.location ), store.getState().users ) )
		.flatMap( () => Observable.of( UserActions.updateUsers( getUsersFromLocation( store.getState().router.location ) ) ) )
);
