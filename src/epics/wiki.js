/* eslint-env browser */
import { Observable } from 'rxjs';
import { Map } from 'immutable';
import { replace, LOCATION_CHANGE } from 'react-router-redux';
import qs from 'querystring';
import getQueryFromLocation from 'app/utils/location-query';
import Wiki from 'app/entities/wiki';
import * as WikiActions from 'app/actions/wiki';
import * as QueryActions from 'app/actions/query';

function getWikiFromLocation( location ) {
	let query = getQueryFromLocation( location );

	return query.wiki ? query.wiki : '';
}

export const fetchAllWikis = ( action$ ) => (
	action$.ofType( 'WIKI_LIST_FETCH' )
		.first()
		.flatMap( () => (
			Observable.ajax( {
				url: 'https://meta.wikimedia.org/w/api.php?action=sitematrix&format=json&origin=*',
				crossDomain: true,
				responseType: 'json'
			} )
				.map( ( ajaxResponse ) => {
					const wikis = Object.keys( ajaxResponse.response.sitematrix ).filter( ( key ) => {
						return ( !isNaN( parseFloat( key ) ) && isFinite( key ) ) || key === 'specials';
					} )
						.map( ( key ) => {
							// Special is different for some reason.
							if ( key === 'specials' ) {
								return {
									site: ajaxResponse.response.sitematrix[ key ]
								};
							}

							return ajaxResponse.response.sitematrix[ key ];
						} )
						.reduce( ( state, data ) => (
							[
								...state,
								...data.site.map( ( item ) => (
									new Wiki( {
										id: item.dbname,
										name: item.sitename,
										domain: new URL( item.url ).hostname
									} )
								) )
							]
						), [] )
						.reduce( ( state, data ) => ( state.set( data.id, data ) ), new Map() );
					return WikiActions.setWikis( wikis );
				} )
				.catch( () => Observable.of( WikiActions.setWikis( new Map() ) ) )
		) )
);

export const pushWikiToLocation = ( action$, store ) => (
	action$.ofType( 'WIKI_SET' )
		.filter( ( action ) => getWikiFromLocation( store.getState().router.location ) !== action.wiki )
		.flatMap( ( action ) => {
			let location = store.getState().router.location;
			let query = getQueryFromLocation( store.getState().router.location );

			if ( action.wiki ) {
				query = {
					...query,
					wiki: action.wiki
				};
			} else {
				delete query.wiki;
			}

			location = {
				...location,
				search: '?' + qs.stringify( query )
			};

			return Observable.of( replace( location ) );
		} )
);

export const pushLocationToWiki = ( action$, store ) => (
	action$.ofType( LOCATION_CHANGE )
		.filter( () => getWikiFromLocation( store.getState().router.location ) !== store.getState().query.wiki )
		.flatMap( () => Observable.of( QueryActions.setQueryValue( 'wiki', getWikiFromLocation( store.getState().router.location ) ) ) )
);
