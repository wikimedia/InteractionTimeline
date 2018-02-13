import { Observable, AjaxError } from 'rxjs';
import { Map, OrderedMap, Set } from 'immutable';
import * as RevisionsActions from 'app/actions/revisions';
import getRevisions from 'app/utils/revisions';
import getLastRevision from 'app/utils/last-revision';
import Revision from 'app/entities/revision';
import Page from 'app/entities/page';
import * as QueryActions from 'app/actions/query';

const buildRevisionUrl = ( domain, user, startDate, endDate, cont ) => {
	// The API always orderes by "user,timestamp". This means the oldest user could
	// get all of the results. To prevent this, we'll request one user at a time.
	let url = `https://${domain}/w/api.php?action=query&list=usercontribs&ucuser=${encodeURIComponent( user )}&ucdir=newer&format=json&origin=*&formatversion=2`;

	if ( startDate ) {
		url += '&ucstart=' + startDate;
	}

	if ( endDate ) {
		url += '&ucend=' + endDate;
	}

	if ( cont ) {
		url += '&uccontinue=' + cont;
	}

	return url;
};

const builPageUrl = ( domain, user, pageid ) => {
	// The API only allows a single page lookup at a time.
	return `https://${domain}/w/api.php?action=query&prop=revisions&pageids=${pageid}&rvuser=${encodeURIComponent( user )}&rvlimit=1&origin=*&formatversion=2&format=json`;
};

// Dispatch an action when the query changes from ready to not ready (or vice-versa)
export const revisionsReady = ( action$, store ) => (
	action$
		.filter( ( action ) => [ ...QueryActions.EVENTS, 'WIKIS_SET', 'REVISIONS_ERROR_CLEAR' ].includes( action.type ) )
		// Determine if the query is ready or not.
		.map( () => !!store.getState().query.wiki && !store.getState().wikis.isEmpty() && store.getState().query.user.count() >= 2 )
		// Wait until the status has changed.
		.filter( ready => !( ready && store.getState().revisions.status === 'ready' ) )
		.filter( ready => !( !ready && store.getState().revisions.status === 'notready' ) )
		.map( ( ready ) => {
			return ready ? RevisionsActions.setStatusReady() : RevisionsActions.setStatusNotReady();
		} )
);

export const shouldFetchRevisions = ( action$, store ) => (
	action$.filter( ( action ) => [
		...QueryActions.EVENTS,
		'WIKIS_SET',
		'REVISIONS_READY'
	].includes( action.type ) )
		.filter( () => store.getState().revisions.status !== 'notready' )
		.flatMap( () => {
			const users = store.getState().query.user
				.filter( user => !store.getState().revisions.cont.keySeq().includes( user ) );

			return Observable.of( users );
		} )
		.filter( users => !users.isEmpty() )
		.flatMap( ( users ) => Observable.of( RevisionsActions.fetchRevisions( users ) ) )
);

export const revisionStatus = ( action$, store ) => (
	action$.ofType( 'REVISIONS_ADD' )
		.map( ( action ) => {
			const cont = store.getState().revisions.cont;

			if ( cont.filter( c => c !== false ).isEmpty() ) {
				return RevisionsActions.setStatusDone();
			}

			if ( action.revisions.isEmpty() ) {
				return RevisionsActions.setStatusReady();
			}

			const users = store.getState().query.user;
			const revisions = store.getState().revisions.list;
			const pages = store.getState().pages;
			const last = getLastRevision( revisions, users, cont );

			if ( !last ) {
				return RevisionsActions.setStatusReady();
			}

			if ( !getRevisions( users, revisions, last, pages ).isEmpty() ) {
				return RevisionsActions.setStatusReady();
			}

			return RevisionsActions.fetchRevisions( new Set( [ last.user ] ) );
		} )
);

export const fetchRevision = ( action$, store ) => (
	action$
		.ofType( 'REVISIONS_SINGLE_FETCH' )
		.flatMap( action => {
			const wiki = store.getState().query.wiki;
			const domain = store.getState().wikis.get( wiki ).domain;

			// @TODO Add a takeUntil.
			const request = Observable.ajax( {
				url: `https://${domain}/w/api.php?action=query&format=json&prop=revisions&revids=${action.id}&formatversion=2&origin=*`,
				crossDomain: true,
				responseType: 'json'
			} )
				.flatMap( ajaxResponse => {
					if ( ajaxResponse.response.error ) {
						throw new AjaxError(
							ajaxResponse.response.error.info,
							ajaxResponse.xhr,
							ajaxResponse.request
						);
					}
					if (
						!ajaxResponse.response.query ||
						!ajaxResponse.response.query.pages ||
						!ajaxResponse.response.query.pages[ 0 ] ||
						!ajaxResponse.response.query.pages[ 0 ].revisions ) {
						throw new AjaxError(
							'Bad Response',
							ajaxResponse.xhr,
							ajaxResponse.request
						);
					}

					const data = ajaxResponse.response.query.pages[ 0 ];

					return Observable.of( RevisionsActions.addRevision( new Revision( {
						id: data.revisions[ 0 ].revid,
						...data,
						...data.revisions[ 0 ]
					} ) ) );
				} )
				// If the wiki changes, cancel the request.
				.takeUntil( action$.ofType( 'QUERY_WIKI_CHANGE' ).filter( a => a.wiki !== wiki ) )
				// If the revision was deleted, cancel the request.
				.takeUntil( action$.ofType( 'REVISIONS_DELETE' ).filter( a => a.revisions.has( action.id ) ) )
				.catch( ( error ) => Observable.of( RevisionsActions.throwRevisionError( action.id, error ) ) );

			// The revision is not in the store, so we'll add it with the current
			// status.
			const revision = new Revision( {
				id: action.id,
				meta: {
					status: 'fetching'
				}
			} );

			return Observable.concat(
				Observable.of( RevisionsActions.addRevision( revision ) ),
				request
			);
		} )
);

export const fetchRevisions = ( action$, store ) => (
	action$
		.ofType( 'REVISIONS_FETCH' )
		.flatMap( ( action ) => {
			// Remove any users who have a false continue.
			const users = action.users.filter( ( user ) => {
				return store.getState().revisions.cont.get( user ) !== false;
			} );

			// If the set of users is empty, no need to attempt a request.
			if ( users.isEmpty() ) {
				return Observable.of( RevisionsActions.addRevisions( new OrderedMap() ) );
			}

			const requests = users
				.map( user => {
					// Set the variables so the request can be canceled if the state
					// changes.
					const wiki = store.getState().query.wiki;
					const domain = store.getState().wikis.get( wiki ).domain;
					const startDate = store.getState().query.startDate;
					const endDate = store.getState().query.endDate;
					const cont = store.getState().revisions.cont.get( user );

					return Observable.ajax( {
						url: buildRevisionUrl( domain, user, startDate, endDate, cont ),
						crossDomain: true,
						responseType: 'json'
					} )
						.map( ( ajaxResponse ) => {
							if ( ajaxResponse.response.error ) {
								throw new AjaxError(
									ajaxResponse.response.error.info,
									ajaxResponse.xhr,
									ajaxResponse.request
								);
							}

							const contribs = ajaxResponse.response.query ? ajaxResponse.response.query.usercontribs : [];

							const revisions = new OrderedMap(
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

							return {
								revisions,
								cont: new Map( {
									[ user ]: ajaxResponse.response.continue ? ajaxResponse.response.continue.uccontinue : false
								} )
							};
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

			return Observable.forkJoin( requests.toArray() )
				.flatMap( ( data ) => {

					if ( data.length === 0 ) {
						return Observable.of( RevisionsActions.addRevisions( new OrderedMap() ) );
					}

					const revisions = data.reduce( ( map, item ) => {
						return map.merge( item.revisions );
					}, new OrderedMap() );
					const cont = data.reduce( ( map, item ) => {
						return map.merge( item.cont );
					}, new Map() );

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
						return Observable.of( RevisionsActions.addRevisions( revisions, pages, cont ) );
					}

					const wiki = store.getState().query.wiki;

					const pageRequests = pageSet.map( ( userPage ) => {
						return Observable.ajax( {
							url: builPageUrl( store.getState().wikis.get( wiki ).domain, userPage.user, userPage.page.id ),
							crossDomain: true,
							responseType: 'json'
						} )
							.flatMap( ( ajaxResponse ) => {
								if ( ajaxResponse.response.error ) {
									throw new AjaxError(
										ajaxResponse.response.error.info,
										ajaxResponse.xhr,
										ajaxResponse.request
									);
								}

								if ( ajaxResponse.response.query.pages.length === 0 ) {
									return Observable.of( data.page );
								}

								const item = ajaxResponse.response.query.pages[ 0 ];
								return Observable.of( userPage.page.setIn( [ 'editors', userPage.user ], typeof item.revisions !== 'undefined' && item.revisions.length > 0 ) );
							} )
							// If the page was deleted, cancel the request.
							.takeUntil( action$.ofType( 'PAGES_DELETE' ).filter( a => !a.pages.filter( page => page.id === data.page.id ).isEmpty() ) )
							// If the user is no longer in the query, cancel the request.
							.takeUntil( action$.ofType( 'QUERY_USER_CHANGE' ).filter( a => !a.users.includes( data.user ) ) )
							// If the wiki changes, cancel the request.
							.takeUntil( action$.ofType( 'QUERY_WIKI_CHANGE' ).filter( a => a.wiki !== wiki ) );
					} );

					return Observable.forkJoin( pageRequests.toArray() )
						.flatMap( ( pageResponses ) => {
							const pageMap = pageResponses
								.reduce( ( map, page ) => {
									return map.set( page.id, page );
								}, pages );

							return Observable.of( RevisionsActions.addRevisions( revisions, pageMap, cont ) );
						} );
				} )
				.catch( ( error ) => Observable.of( RevisionsActions.throwError( error ) ) );
		} )
);
