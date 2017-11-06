import { Observable } from 'rxjs';
import { OrderedMap } from 'immutable';
import * as RevisionsActions from 'app/actions/revisions';
import RevisionEntity from 'app/entities/revision';

const buildUrl = ( state ) => {
	const domain = state.wikis.get( state.query.wiki ).domain;
	const users = state.query.user.join( '|' );
	let url = 'https://' + domain + '/w/api.php?action=query&list=usercontribs&ucuser=' + users + '&uclimit=500&ucdir=older&format=json&origin=*';

	// NOTE: since we are doing ucdir=older, ucstart and ucend need to be switched.
	const ucend = state.query.startDate;
	if ( ucend ) {
		url += '&ucend=' + ucend;
	}

	return url;
};

const fetchRevisions = ( action$, store ) => (
	action$
		.skipUntil( action$.ofType( 'WIKIS_SET' ) )
		.filter( ( action ) => {
			return [ 'QUERY_UPDATE', 'QUERY_SET_VALUE' ].includes( action.type );
		} )
		.filter( () => {
			return store.getState().query.user.size > 0;
		} )
		.switchMap( () => {
			return Observable.ajax( {
				url: buildUrl( store.getState() ),
				crossDomain: true,
				responseType: 'json'
			} )
				.map( ( ajaxResponse ) => {
					const contribs = ajaxResponse.response.query.usercontribs;

					let revisions = new OrderedMap();
					for ( let data of contribs ) {
						revisions = revisions.set(
							data.revid,
							new RevisionEntity( {
								id: data.revid,
								title: data.title,
								user: data.user,
								timestamp: data.timestamp,
								comment: data.comment
							} )
						);
					}

					return RevisionsActions.setRevisions( revisions );
				} )
				.catch( () => {
					return Observable.of( RevisionsActions.setRevisions( new OrderedMap() ) );
				} );
		} )
);

export default fetchRevisions;
