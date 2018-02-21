import { Observable } from 'rxjs';
import qs from 'querystring';
import { replace, LOCATION_CHANGE } from 'react-router-redux';
import getQueryFromLocation from 'app/utils/location-query';
import { EVENTS as QUERY_EVENTS, updateQuery } from 'app/actions/query';

export const pushQueryToLocation = ( action$, store ) => (
	action$.filter( ( action ) => QUERY_EVENTS.includes( action.type ) )
		// If there are no users and no search query, no action needs to be taken.
		.filter( () => !getQueryFromLocation( store.getState().router.location ).equals( store.getState().query ) )
		.flatMap( () => {
			let location = store.getState().router.location;
			let query = getQueryFromLocation( location );

			query = {
				...query,
				...store.getState().query.toJS()
			};

			// Remove the _map key.
			// eslint-disable-next-line no-underscore-dangle
			delete query._map;

			// Remove any keys that have empty values.
			Object.keys( query ).forEach( ( key ) => {
				if ( !query[ key ] ) {
					delete query[ key ];
				}
			} );

			location = {
				...location,
				search: '?' + qs.stringify( query )
			};

			return Observable.of( replace( location ) );
		} )
);

export const pushLocationToQuery = ( action$, store ) => (
	action$.ofType( LOCATION_CHANGE )
		// If there are no users and no search query, no action needs to be taken.
		.filter( () => !getQueryFromLocation( store.getState().router.location ).equals( store.getState().query ) )
		.flatMap( () => Observable.of( updateQuery( getQueryFromLocation( store.getState().router.location ) ) ) )
);
