import { Observable } from 'rxjs';
import qs from 'querystring';
import { replace, LOCATION_CHANGE } from 'react-router-redux';
import getQueryFromLocation from 'app/utils/location-query';
import * as QueryActions from 'app/actions/query';

// Dispatch an action when the wiki has changed.
export const wikiSwitch = ( action$, store ) => (
	action$
		.filter( ( action ) => [ 'QUERY_UPDATE', 'QUERY_SET_VALUE', 'WIKIS_SET' ].includes( action.type ) )
		.filter( () => !!store.getState().query.wiki && store.getState().wikis.size > 0 )
		.flatMap( () => Observable.of( store.getState().query.wiki ) )
		.distinctUntilChanged()
		.flatMap( ( wiki ) => Observable.of( QueryActions.wikiChange( wiki ) ) )
);

// Dispatch an action when the user(s) have changed.
export const userSwitch = ( action$, store ) => (
	action$
		.filter( ( action ) => [ 'QUERY_UPDATE', 'QUERY_SET_VALUE' ].includes( action.type ) )
		.flatMap( () => Observable.of( store.getState().query.user ) )
		.distinctUntilChanged()
		.flatMap( ( users ) => Observable.of( QueryActions.userChange( users ) ) )
);

// Dispatch an action when the start date changes.
export const startDateSwitch = ( action$, store ) => (
	action$
		.filter( ( action ) => [ 'QUERY_UPDATE', 'QUERY_SET_VALUE' ].includes( action.type ) )
		.flatMap( () => Observable.of( store.getState().query.startDate ) )
		.distinctUntilChanged()
		.flatMap( ( startDate ) => Observable.of( QueryActions.startDateChange( startDate ) ) )
);

// Dispatch an action when the end date changes
export const endDateSwitch = ( action$, store ) => (
	action$
		.filter( ( action ) => [ 'QUERY_UPDATE', 'QUERY_SET_VALUE' ].includes( action.type ) )
		.flatMap( () => Observable.of( store.getState().query.endDate ) )
		.distinctUntilChanged()
		.flatMap( ( endDate ) => Observable.of( QueryActions.endDateChange( endDate ) ) )
);

export const pushQueryToLocation = ( action$, store ) => (
	action$.filter( ( action ) => [ 'QUERY_UPDATE', 'QUERY_SET_VALUE' ].includes( action.type ) )
		// If there are no users and no search query, no action needs to be taken.
		.filter( ( action ) => !getQueryFromLocation( store.getState().router.location ).equals( action.query ) )
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
		.flatMap( () => Observable.of( QueryActions.updateQuery( getQueryFromLocation( store.getState().router.location ) ) ) )
);
