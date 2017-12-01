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

			const remove = store.getState().revisions.list.filter( revision => {
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
		.flatMap( () => {
			const users = store.getState().query.user
				.filter( user => !store.getState().revisions.list.find( revision => revision.user === user ) );

			return Observable.of( users );
		} )
		.filter( users => !!users.size )
		// Get all of the pages for each user.
		// @TODO We need to prevent re-requesting users we have already requested.
		//       Perhaps use "continue" for this purpose? or rather, continue would
		//       determine whether a request needs to take place or not.
		//       Also need to cancel request for users we remove.
		.switchMap( ( users ) => {
			const requests = users
				// Remove users who already have revisions.
				.filter( user => !store.getState().revisions.list.find( revision => revision.user === user ) )
				.map( user => (
					Observable.ajax( {
						url: buildUrl( store.getState().wikis.get( store.getState().query.wiki ).domain, user, store.getState().query ),
						crossDomain: true,
						responseType: 'json'
					} )
						.map( ( ajaxResponse ) => {
							const contribs = ajaxResponse.response.query.usercontribs;

							return new Map(
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
				) ).toArray();

			return Observable.forkJoin( requests );
		} )
		.flatMap( ( data ) => {
			const revisions = new OrderedMap()
				.merge( ...data );

			return Observable.of( RevisionsActions.addRevisions( revisions ) );
		} )
		.catch( () => Observable.of( RevisionsActions.setRevisions( new OrderedMap() ) ) )
);
