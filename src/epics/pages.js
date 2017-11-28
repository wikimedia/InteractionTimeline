import { Observable } from 'rxjs';
import { Map, Set } from 'immutable';
import * as PagesActions from 'app/actions/pages';

const buildUrl = ( domain, user, pageid ) => {
	// The API only allows a single page lookup at a time.
	return `https://${domain}/w/api.php?action=query&prop=revisions&pageids=${pageid}&rvuser=${user}&rvlimit=1&origin=*&formatversion=2&format=json`;
};

const fetchPages = ( action$, store ) => (
	action$
		.ofType( 'REVISIONS_SET' )
		// Ensure that all the necessary data is present.
		.filter( () => !!store.getState().query.wiki && store.getState().wikis.size > 0 )
		// Get a list of all of the unique users.
		.flatMap( () => {
			const users = store.getState().pages.reduce( ( set, page ) => {
				return set.concat( page.editors.keySeq() );
			}, new Set() ).toArray();

			return Observable.from( users );
		} )
		// Get all of the pages for each user.
		.map( ( user ) => {
			const pages = store.getState().pages.filter( ( page ) => !page.editors.has( user ) );

			return { user, pages };
		} )
		// If the user is on all pages, there are no pages to deteremine.
		.filter( ( data ) => !!data.pages.size )
		.flatMap( ( data ) => {
			const requests = data.pages.map( ( page ) => {
				return Observable.ajax( {
					url: buildUrl( store.getState().wikis.get( store.getState().query.wiki ).domain, data.user, page.id ),
					crossDomain: true,
					responseType: 'json'
				} )
					.flatMap( ( ajaxResponse ) => {
						if ( ajaxResponse.response.query.pages.length === 0 ) {
							return page;
						}

						const item = ajaxResponse.response.query.pages[ 0 ];

						return Observable.of( page.setIn( [ 'editors', data.user ], typeof item.revisions !== 'undefined' && item.revisions.length > 0 ) );
					} );
			} ).toArray();

			return Observable.forkJoin( requests );
		} )
		.flatMap( ( data ) => {
			const pages = data
				.reduce( ( map, page ) => {
					return map.set( page.id, page );
				}, new Map() );

			// This is causing a loop! perhaps attach the user we are sending?
			return Observable.of( PagesActions.updatePages( pages ) );
		} )
);

export default fetchPages;
