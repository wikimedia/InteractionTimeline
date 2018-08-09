import { Observable } from 'rxjs';
import qs from 'querystring';
import moment from 'moment';
import { replace, LOCATION_CHANGE } from 'react-router-redux';
import getQueryFromLocation from 'app/utils/location-query';
import Query from 'app/entities/query';
import { EVENTS as QUERY_EVENTS, updateQuery, setDefaultQuery } from 'app/actions/query';

export const pushQueryToLocation = ( action$, store ) => (
	action$.filter( ( action ) => QUERY_EVENTS.includes( action.type ) )
		// If there are no users and no search query, no action needs to be taken.
		.filter( () => !getQueryFromLocation( store.getState().router.location ).equals( store.getState().query ) )
		.flatMap( () => {
			let location = store.getState().router.location;
			const query = getQueryFromLocation( location ).merge( store.getState().query ).toJS();

			// Remove any keys that have empty values.
			Object.keys( query ).forEach( ( key ) => {
				if ( !query[ key ] || query[ key ].length === 0 ) {
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

export const setDefaultQueryOnLoad = ( action$, store ) => (
	action$.ofType( LOCATION_CHANGE )
		// Only set the default query on the initial location change.
		.first()
		// If the query is empty, set the default.
		.filter( () => getQueryFromLocation( store.getState().router.location ).equals( new Query() ) )
		// Do not update the URL on page load, wait for some other action.
		.flatMap( () => {
			const query = new Query( {
				startDate: moment.utc().startOf( 'day' ).subtract( 30, 'days' ).unix().toString()
			} );

			return Observable.of( setDefaultQuery( query ) );
		} )
);

export const pushLocationToQuery = ( action$, store ) => (
	action$.ofType( LOCATION_CHANGE )
		// If there are no users and no search query, no action needs to be taken.
		.filter( () => !getQueryFromLocation( store.getState().router.location ).equals( store.getState().query ) )
		.flatMap( () => Observable.of( updateQuery( getQueryFromLocation( store.getState().router.location ) ) ) )
);
