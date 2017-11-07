import { Observable } from 'rxjs';
import { OrderedMap } from 'immutable';
import * as RevisionsActions from 'app/actions/revisions';
import Revision from 'app/entities/revision';

const buildUrl = ( state ) => {
	const domain = state.wikis.get( state.query.wiki ).domain;
	const users = state.query.user.join( '|' );
	let url = 'https://' + domain + '/w/api.php?action=query&list=usercontribs&ucuser=' + users + '&uclimit=500&ucdir=newer&format=json&origin=*';

	if ( state.query.startDate ) {
		url += '&ucstart=' + state.query.startDate;
	}

	if ( state.query.endDate ) {
		url += '&ucend=' + state.query.endDate;
	}

	return url;
};

const fetchRevisions = ( action$, store ) => (
	action$
		.filter( ( action ) => [ 'QUERY_UPDATE', 'QUERY_SET_VALUE', 'WIKIS_SET' ].includes( action.type ) )
		// Ensure that all the necessary data is present.
		.filter( () => !!store.getState().query.wiki && store.getState().wikis.size > 0 && store.getState().query.user.size > 0 )
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

export default fetchRevisions;
