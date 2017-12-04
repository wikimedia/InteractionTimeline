import { Observable } from 'rxjs';
import { Map, Set } from 'immutable';
import * as PagesActions from 'app/actions/pages';
import * as RevisionsActions from 'app/actions/revisions';

const buildUrl = ( domain, user, pageid ) => {
	// The API only allows a single page lookup at a time.
	return `https://${domain}/w/api.php?action=query&prop=revisions&pageids=${pageid}&rvuser=${user}&rvlimit=1&origin=*&formatversion=2&format=json`;
};

export const clearPages = ( action$, store ) => (
	action$
		.filter( ( action ) => [ 'REVISIONS_DELETE', 'QUERY_USER_CHANGE' ].includes( action.type ) )
		.flatMap( () => {
			const pages = store.getState().pages.filter( page =>
				!store.getState().revisions.list.filter( revision => revision.pageid === page.id ).isEmpty()
			);

			return Observable.of( PagesActions.removePages( pages ) );
		} )
);

export const fetchPages = ( action$, store ) => (
	action$
		.ofType( 'REVISIONS_ADD' )
		// Get a list of  all of the unique users.
		.flatMap( () => {
			const users = store.getState().query.user;
			const pageSet = store.getState().pages.reduce( ( set, page ) => {
				const items = users.reduce( ( list, user ) => {
					if ( page.editors.has( user ) ) {
						return list;
					}

					// If the user is not one of the editors, add it to the list.
					return list.add( {
						page,
						user
					} );
				}, new Set() );

				return set.merge( items );
			}, new Set() );

			// If there are no pages to retrieve, then we are done.
			if ( !pageSet.size ) {
				return Observable.of( RevisionsActions.setStatusReady() );
			}

			const wiki = store.getState().query.wiki;

			const requests = pageSet.map( ( data ) => {
				return Observable.ajax( {
					url: buildUrl( store.getState().wikis.get( wiki ).domain, data.user, data.page.id ),
					crossDomain: true,
					responseType: 'json'
				} )
					.flatMap( ( ajaxResponse ) => {
						if ( ajaxResponse.response.query.pages.length === 0 ) {
							return Observable.of( data.page );
						}

						const item = ajaxResponse.response.query.pages[ 0 ];
						return Observable.of( data.page.setIn( [ 'editors', data.user ], typeof item.revisions !== 'undefined' && item.revisions.length > 0 ) );
					} )
					// If the page was deleted, cancel the request.
					.takeUntil( action$.ofType( 'PAGES_DELETE' ).filter( action => !action.pages.filter( page => page.id === data.page.id ).isEmpty() ) )
					// If the user is no longer in the query, cancel the request.
					.takeUntil( action$.ofType( 'QUERY_USER_CHANGE' ).filter( action => !action.users.includes( data.user ) ) )
					// If the wiki changes, cancel the request.
					.takeUntil( action$.ofType( 'QUERY_WIKI_CHANGE' ).filter( action => action.wiki !== wiki ) );
			} );

			return Observable.forkJoin( requests.toArray() )
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
