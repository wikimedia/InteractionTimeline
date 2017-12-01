import { Observable } from 'rxjs';
import { OrderedMap } from 'immutable';
import * as RevisionsActions from 'app/actions/revisions';
import Revision from 'app/entities/revision';

const buildUrl = ( domain, user, query ) => {
	// The API always orderes by "user,timestamp". This means the oldest user could
	// get all of the results. To prevent this, we'll request one user at a time.
	let url = `https://${domain}/w/api.php?action=query&list=usercontribs&ucuser=${encodeURIComponent( user )}&ucdir=newer&format=json&origin=*&formatversion=2`;

	if ( query.startDate ) {
		url += '&ucstart=' + query.startDate;
	}

	if ( query.endDate ) {
		url += '&ucend=' + query.endDate;
	}

	return url;
};

export const clearUserRevisions = ( action$, store ) => (
	action$
		.filter( ( action ) => [ 'QUERY_UPDATE', 'QUERY_SET_VALUE' ].includes( action.type ) )
		.flatMap( () => {
			const users = store.getState().query.user;

			const remove = store.getState().revisions.filter( revision => {
				return !users.includes( revision.user );
			} );

			return Observable.of( remove );
		} )
		.filter( data => !!data.size )
		.flatMap( data => Observable.of( RevisionsActions.deleteRevisions( data ) ) )
);

// @TODO After revisions are deleted, we should clean up the pages.
//       Remove the editors from the store that are no longer in there.
//       If there are no revisions left at all, delete all the page.
export const shouldFetchRevisions = ( action$, store ) => (
	action$
		.filter( ( action ) => [ 'QUERY_UPDATE', 'QUERY_SET_VALUE', 'WIKIS_SET' ].includes( action.type ) )
		.filter( () => !!store.getState().query.wiki && store.getState().wikis.size > 0 && store.getState().query.user.size > 0 )
		.flatMap( () => Observable.of( RevisionsActions.fetchRevisions() ) )
);

export const hideLoader = ( action$, store ) => (
	action$
		.filter( ( action ) => [ 'QUERY_UPDATE', 'QUERY_SET_VALUE', 'WIKIS_SET' ].includes( action.type ) )
		.filter( () => !store.getState().query.wiki || !store.getState().query.user.size )
		.flatMap( () => Observable.of( RevisionsActions.setStatusReady() ) )
);

export const fetchRevisions = ( action$, store ) => (
	action$
		.ofType( 'REVISIONS_FETCH' )
		.switchMap( () => {
			return Observable.ajax( {
				url: buildUrl( store.getState() ),
				crossDomain: true,
				responseType: 'json'
			} )
				.map( ( ajaxResponse ) => {
					const contribs = ajaxResponse.response.query.usercontribs;

					const revisions =
						new OrderedMap(
							contribs.map( ( data ) => (
								[
									data.revid,
									new Revision( {
										id: data.revid,
										...data
									} )
								]
							) )
						)
							// Since the ids are all from the same wiki, they are in a
							// guaranteed order from oldest to newest.
							.sort( ( a, b ) => a.id - b.id );

					return RevisionsActions.setRevisions( revisions );
				} )
				.catch( () => Observable.of( RevisionsActions.setRevisions( new OrderedMap() ) ) );
		} )
);
