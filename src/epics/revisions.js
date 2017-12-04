import { Observable } from 'rxjs';
import { OrderedMap } from 'immutable';
import * as RevisionsActions from 'app/actions/revisions';
import Revision from 'app/entities/revision';

const buildUrl = ( domain, user, startDate, endDate ) => {
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
						url: buildUrl( store.getState().wikis.get( wiki ).domain, user, startDate, endDate ),
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
						.takeUntil( action$.ofType( 'QUERY_USER_CHANGE' ).filter( action => !action.users.includes( user ) ) )
						// If the wiki changes, cancel the request.
						.takeUntil( action$.ofType( 'QUERY_WIKI_CHANGE' ).filter( action => action.wiki !== wiki ) )
						// If the start date changes, cancel the request.
						.takeUntil( action$.ofType( 'QUERY_START_DATE_CHANGE' ).filter( action => action.startDate !== startDate ) )
						// If the end date changes, cancel the request.
						.takeUntil( action$.ofType( 'QUERY_END_DATE_CHANGE' ).filter( action => action.endDate !== endDate ) );
				} );

			return Observable.forkJoin( requests.toArray() );
		} )
		.flatMap( ( data ) => {
			const revisions = new OrderedMap()
				.merge( ...data );

			return Observable.of( RevisionsActions.addRevisions( revisions ) );
		} )
		.catch( () => Observable.of( RevisionsActions.addRevisions( new OrderedMap() ) ) )
);
