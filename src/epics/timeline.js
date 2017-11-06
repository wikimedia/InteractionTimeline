import { Observable } from 'rxjs';
import { Map, OrderedMap } from 'immutable';
import * as TimelineActions from 'app/actions/timeline';
import RevisionEntity from 'app/entities/revision';

const getWikiDomain = ( wiki, wikis ) => {
	let wikiRecord = wikis.find( ( obj ) => {
		return obj.get( 'id' ) === wiki;
	} );

	return wikiRecord.domain;
};

const buildUrl = ( store ) => {
	const domain = getWikiDomain( store.getState().query.wiki, store.getState().wikis );
	const users = store.getState().query.user.join( '|' );
	const ucstart = store.getState().query.startDate;

	let url = 'https://' + domain + '/w/api.php?action=query&list=usercontribs&ucuser=' + users + '&ucstart=' + ucstart + '&uclimit=500&ucdir=older&format=json&origin=*';

	return url;
};

const fetchTimeline = ( action$, store ) => (
	action$.filter( ( action ) => {
		return [ 'QUERY_UPDATE', 'QUERY_SET_VALUE', 'WIKIS_SET' ].includes( action.type );
	} )
		.filter( () => {
			return !!store.getState().wikis.size;
		} )
		.filter( () => {
			return !( store.getState().query.user.size < 2 || !store.getState().query.startDate );
		} )
		.switchMap( () => {
			const url = buildUrl( store );
			return Observable.ajax( {
				url: url,
				crossDomain: true,
				responseType: 'json'
			} )
				.map( ( ajaxResponse ) => {
					const contribs = ajaxResponse.response.query.usercontribs;

					let timeline = new OrderedMap();
					for ( let data of contribs ) {
						timeline = timeline.set(
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

					return TimelineActions.setTimeline( timeline );
				} )
				.catch( () => {
					return Observable.of( TimelineActions.setTimeline( new Map() ) );
				} );
		} )
);

export default fetchTimeline;
