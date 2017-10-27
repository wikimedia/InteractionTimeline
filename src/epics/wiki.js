import { Observable } from 'rxjs';
import qs from 'querystring';
import { push, LOCATION_CHANGE } from 'react-router-redux';
import getQueryFromLocation from 'app/utils/location-query';
import * as WikiActions from 'app/actions/wiki';

function getWikiFromLocation( location ) {
	let query = getQueryFromLocation( location );

	return query.wiki ? query.wiki : '';
}

// @TODO Get the sitematrix so the users can choose the wiki.

export const pushWikiToLocation = ( action$, store ) => (
	action$.ofType( 'WIKI_SET' )
		.filter( ( action ) => getWikiFromLocation( store.getState().router.location ) !== action.wiki )
		.flatMap( ( action ) => {
			let location = store.getState().router.location;
			let query = getQueryFromLocation( store.getState().router.location );

			if ( action.query ) {
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

			return Observable.of( push( location ) );
		} )
);

export const pushLocationToWiki = ( action$, store ) => (
	action$.ofType( LOCATION_CHANGE )
		.filter( () => getWikiFromLocation( store.getState().router.location ) !== store.getState().wiki.id )
		.flatMap( () => Observable.of( WikiActions.setWiki( getWikiFromLocation( store.getState().router.location ) ) ) )
);
