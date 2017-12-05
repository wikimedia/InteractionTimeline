import { Observable } from 'rxjs';
import { Map, OrderedMap, Set } from 'immutable';
import * as RevisionsActions from 'app/actions/revisions';
import Revision from 'app/entities/revision';
import Page from 'app/entities/page';

const buildRevisionUrl = ( domain, user, startDate, endDate ) => {
	// The API always orderes by "user,timestamp". This means the oldest user could
	// get all of the results. To prevent this, we'll request one user at a time.
	let url = `https://${domain}/w/api.php?action=query&list=usercontribs&ucuser=${encodeURIComponent( user )}&ucdir=newer&format=json&origin=*&formatversion=2`;

	if ( startDate ) {
		url += '&ucstart=' + startDate;
	}

	if ( endDate ) {
		url += '&ucend=' + endDate;
	}

	return url;
};

const builPageUrl = ( domain, user, pageid ) => {
	// The API only allows a single page lookup at a time.
	return `https://${domain}/w/api.php?action=query&prop=revisions&pageids=${pageid}&rvuser=${user}&rvlimit=1&origin=*&formatversion=2&format=json`;
};

// Dispatch an action when the query changes from ready to not ready (or vice-versa)
export const revisionsReady = ( action$, store ) => (
	action$
		.filter( ( action ) => [ 'QUERY_UPDATE', 'QUERY_SET_VALUE', 'WIKIS_SET' ].includes( action.type ) )
		// Determine if the query is ready or not.
		.flatMap( () => Observable.of( !!store.getState().query.wiki && store.getState().wikis.size > 0 && store.getState().query.user.size > 0 ) )
		// Wait until the status has changed.
		.distinctUntilChanged()
		.map( ( ready ) => {
			return ready ? RevisionsActions.setStatusReady() : RevisionsActions.setStatusNotReady();
		} )
);

// @TODO Use the "continue" to determine if the user should be fetched.
//       Perhaps it would even be best to just pass along the user name(s) to
//       be fetched.
export const shouldFetchRevisions = ( action$, store ) => (
	action$.filter( ( action ) => [ 'QUERY_UPDATE', 'QUERY_SET_VALUE', 'WIKIS_SET', 'REVISIONS_READY' ].includes( action.type ) )
		.filter( () => store.getState().revisions.status === 'ready' )
		// @TODO We need to prevent re-requesting users we have already requested.
		//       Perhaps use "continue" for this purpose? or rather, continue would
		//       determine whether a request needs to take place or not.
		//       Also need to cancel request for users we remove.
		.flatMap( () => {
			const users = store.getState().query.user
				.filter( user => !store.getState().revisions.list.find( revision => revision.user === user ) );

			return Observable.of( users );
		} )
		.filter( users => !!users.size )
		.flatMap( ( users ) => Observable.of( RevisionsActions.fetchRevisions( users ) ) )
);

export const fetchRevisions = ( action$, store ) => (
	action$
		.ofType( 'REVISIONS_FETCH' )
		.flatMap( ( action ) => {
			const requests = action.users
				.map( user => {
					// Set the variables so the request can be canceled if the state
					// changes.
					const wiki = store.getState().query.wiki;
					const startDate = store.getState().query.startDate;
					const endDate = store.getState().query.endDate;

					return Observable.ajax( {
						url: buildRevisionUrl( store.getState().wikis.get( wiki ).domain, user, startDate, endDate ),
						crossDomain: true,
						responseType: 'json'
					} )
						.map( ( ajaxResponse ) => {
							const contribs = ajaxResponse.response.query.usercontribs;

							return new OrderedMap(
								contribs.map( ( data ) => (
									[
										data.revid,
										new Revision( {
											id: data.revid,
											...data
										} )
									]
								) )
							);
						} )
						// If the query is no longer valid, cancel the request.
						.takeUntil( action$.ofType( 'REVISIONS_NOT_READY' ) )
						// If the user is no longer in the query, cancel the request.
						.takeUntil( action$.ofType( 'QUERY_USER_CHANGE' ).filter( a => !a.users.includes( user ) ) )
						// If the wiki changes, cancel the request.
						.takeUntil( action$.ofType( 'QUERY_WIKI_CHANGE' ).filter( a => a.wiki !== wiki ) )
						// If the start date changes, cancel the request.
						.takeUntil( action$.ofType( 'QUERY_START_DATE_CHANGE' ).filter( a => a.startDate !== startDate ) )
						// If the end date changes, cancel the request.
						.takeUntil( action$.ofType( 'QUERY_END_DATE_CHANGE' ).filter( a => a.endDate !== endDate ) );
				} );

			return Observable.forkJoin( requests.toArray() );
		} )
		.flatMap( ( data ) => {
			const revisions = new OrderedMap()
				.merge( ...data );

			// After getting all of the revisions, update the pages.
			const pages = revisions.reduce( ( reduction, revision ) => {
				if ( reduction.has( revision.pageid ) ) {
					return reduction.setIn( [ revision.pageid, 'editors', revision.user ], true );
				}

				return reduction.set( revision.pageid, new Page( {
					id: revision.pageid,
					title: revision.title,
					editors: new Map( {
						[ revision.user ]: true
					} )
				} ) );
			}, store.getState().pages )
				// If the page is the same as what is already in the store,
				// remove it from the map.
				.filter( page => store.getState().pages.get( page.id ) !== page );

			const users = store.getState().query.user;
			const pageSet = pages.reduce( ( set, page ) => {
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
				return Observable.of( RevisionsActions.addRevisions( revisions, pages ) );
			}

			const wiki = store.getState().query.wiki;

			const requests = pageSet.map( ( userPage ) => {
				return Observable.ajax( {
					url: builPageUrl( store.getState().wikis.get( wiki ).domain, userPage.user, userPage.page.id ),
					crossDomain: true,
					responseType: 'json'
				} )
					.flatMap( ( ajaxResponse ) => {
						if ( ajaxResponse.response.query.pages.length === 0 ) {
							return Observable.of( data.page );
						}

						const item = ajaxResponse.response.query.pages[ 0 ];
						return Observable.of( userPage.page.setIn( [ 'editors', userPage.user ], typeof item.revisions !== 'undefined' && item.revisions.length > 0 ) );
					} )
					// If the page was deleted, cancel the request.
					.takeUntil( action$.ofType( 'PAGES_DELETE' ).filter( action => !action.pages.filter( page => page.id === data.page.id ).isEmpty() ) )
					// If the user is no longer in the query, cancel the request.
					.takeUntil( action$.ofType( 'QUERY_USER_CHANGE' ).filter( action => !action.users.includes( data.user ) ) )
					// If the wiki changes, cancel the request.
					.takeUntil( action$.ofType( 'QUERY_WIKI_CHANGE' ).filter( action => action.wiki !== wiki ) );
			} );

			return Observable.forkJoin( requests.toArray() )
				.flatMap( ( pageResponses ) => {
					const pageMap = pageResponses
						.reduce( ( map, page ) => {
							return map.set( page.id, page );
						}, pages );

					return Observable.of( RevisionsActions.addRevisions( revisions, pageMap ) );
				} );
		} )
		.catch( ( error ) => {
			// @TODO Display errors to the users.
			console.error( error ); // eslint-disable-line no-console
			return Observable.of( RevisionsActions.addRevisions( new OrderedMap() ) );
		} )
);
