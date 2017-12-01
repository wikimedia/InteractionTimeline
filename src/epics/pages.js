import { Observable } from 'rxjs';
import { Map, Set } from 'immutable';
import * as PagesActions from 'app/actions/pages';
import * as RevisionsActions from 'app/actions/revisions';

const buildUrl = ( domain, user, pageid ) => {
	// The API only allows a single page lookup at a time.
	return `https://${domain}/w/api.php?action=query&prop=revisions&pageids=${pageid}&rvuser=${user}&rvlimit=1&origin=*&formatversion=2&format=json`;
};

const fetchPages = ( action$, store ) => (
	action$
		.ofType( 'REVISIONS_SET' )
		// Get a list of  all of the unique users.
		.flatMap( () => {
			const data = store.getState().pages.reduce( ( set, page ) => {
				// Get all the users.
				return set.concat( page.editors.keySeq() );
			}, new Set() )
				.map( ( user ) => {
					const pages = store.getState().pages.filter( ( page ) => !page.editors.has( user ) );
					return { user, pages };
				} )
				.filter( data => !!data.pages.size );

			// If there are no pages to retrieve, then we are done.
			if ( !data.size ) {
				return Observable.of( RevisionsActions.setStatusReady() );
			}

			// @TODO We need to cancel requests for users we don't care about anymore
			//       i.e. they have been removed from the query.

			return Observable.from( data.toArray() )
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

					return Observable.concat(
						Observable.of( PagesActions.updatePages( pages ) ),
						Observable.of( RevisionsActions.setStatusReady() )
					);
				} );
		} )
);

export default fetchPages;
