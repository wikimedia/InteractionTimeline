import { Observable } from 'rxjs';
import { Map, OrderedMap } from 'immutable';
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

export const fetchRevisions = ( action$, store ) => (
	action$
		.filter( ( action ) => [ 'QUERY_UPDATE', 'QUERY_SET_VALUE', 'WIKIS_SET' ].includes( action.type ) )
		// Ensure that all the necessary data is present.
		.filter( () => !!store.getState().query.wiki && store.getState().wikis.size > 0 && store.getState().query.user.size > 0 )
		// Get all of the pages for each user.
		// @TODO We need to prevent re-requesting users we have already requested.
		//       Also need to cancel request for users we remove.
		.switchMap( () => {
			const users = store.getState().query.user;
			const requests = users
				// Remove users who already have revisions.
				.filter( user => !store.getState().revisions.find( revision => revision.user === user ) )
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
				.merge( ...data )
				// Since the ids are all from the same wiki, they are in a guaranteed
				// order from oldest to newest.
				.sortBy( ( revision ) => revision.id );

			return Observable.of( RevisionsActions.setRevisions( revisions ) );
		} )
);
