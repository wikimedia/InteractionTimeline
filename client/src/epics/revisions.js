import { Observable, AjaxError } from 'rxjs';
import { OrderedMap } from 'immutable';
import moment from 'moment';
import {
	setStatusReady,
	setStatusDone,
	setStatusNotReady,
	setStatusFetching,
	fetchRevisions,
	addRevision,
	addRevisions,
	throwError,
	throwRevisionError
} from 'app/actions/revisions';
import Revision from 'app/entities/revision';
import { EVENTS as QUERY_EVENTS } from 'app/actions/query';

const buildRevisionUrl = ( wiki, users, startDate, endDate, cont ) => {
	users = users.map( user => {
		return encodeURIComponent( user );
	} );

	let url = `${process.env.PUBLIC_PATH}api/${wiki}/interaction?user=${users.join( '|' )}`;

	if ( startDate ) {
		url += '&start_date=' + startDate;
	}

	if ( endDate ) {
		url += '&end_date=' + endDate;
	}

	if ( cont ) {
		url += '&continue=' + cont;
	}

	return url;
};

// Dispatch an action when the query changes from ready to not ready (or vice-versa)
export const revisionsReady = ( action$, store ) => (
	action$
		.filter( ( action ) => [ ...QUERY_EVENTS, 'REVISIONS_ERROR_CLEAR' ].includes( action.type ) )
		// Determine if the query is ready or not.
		.map( () => !!store.getState().query.wiki && store.getState().query.user.count() >= 2 )
		// Wait until the status has changed.
		.filter( ready => !( ready && store.getState().revisions.status === 'ready' ) )
		.filter( ready => !( !ready && store.getState().revisions.status === 'notready' ) )
		.map( ( ready ) => {
			return ready ? setStatusReady() : setStatusNotReady();
		} )
);

// Initial fetch of revisions.
export const shouldFetchRevisions = ( action$, store ) => (
	action$.filter( ( action ) => [
		...QUERY_EVENTS,
		'REVISIONS_READY'
	].includes( action.type ) )
		.filter( () => store.getState().revisions.status === 'ready' )
		.filter( () => store.getState().revisions.cont !== false )
		.filter( () => store.getState().revisions.list.isEmpty() )
		.flatMap( () => Observable.of( fetchRevisions() ) )
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

					try {
						// The response may not exist, if so, an error will be thrown.
						const data = ajaxResponse.response.query.pages[ 0 ];

						return Observable.of( addRevision( new Revision( {
							...data,
							...data.revisions[ 0 ],
							id: data.revisions[ 0 ].revid,
							pageId: data.pageid,
							timestamp: moment( data.revisions[ 0 ].timestamp, moment.ISO_8601 ).utc(),
							meta: {
								interaction: false
							}
						} ) ) );
					} catch ( e ) {
						throw new AjaxError(
							'Bad Response',
							ajaxResponse.xhr,
							ajaxResponse.request
						);
					}
				} )
				// If the wiki changes, cancel the request.
				.takeUntil( action$.ofType( 'QUERY_WIKI_CHANGE' ).filter( a => a.wiki !== wiki ) )
				.catch( ( error ) => Observable.of( throwRevisionError( action.id, error ) ) );

			// The revision is not in the store, so we'll add it with the current
			// status.
			const revision = new Revision( {
				id: action.id,
				meta: {
					interaction: false,
					status: 'fetching'
				}
			} );

			return Observable.concat(
				Observable.of( addRevision( revision ) ),
				request
			);
		} )
);

export const doFetchRevisions = ( action$, store ) => (
	action$
		.ofType( 'REVISIONS_FETCH' )
		.filter( () => store.getState().revisions.status === 'ready' )
		.filter( () => store.getState().revisions.cont !== false )
		// If a new fetch is recieved, cancel the old one. We should be careful
		// to not invoke multiple identical requests.
		.switchMap( () => {
			// Set the variables so the request can be canceled if the state
			// changes.
			const wiki = store.getState().query.wiki;
			const users = store.getState().query.user;
			const startDate = store.getState().query.startDate;
			const endDate = store.getState().query.endDate;
			const cont = store.getState().revisions.cont;

			const request = Observable.ajax( {
				url: buildRevisionUrl( wiki, users, startDate, endDate, cont ),
				crossDomain: true,
				responseType: 'json'
			} )
				.flatMap( ( ajaxResponse ) => {
					const contribs = ajaxResponse.response.data ? ajaxResponse.response.data : [];

					// If this is empty, we're done.
					if ( contribs.length === 0 ) {
						return Observable.of( setStatusDone() );
					}

					const revisions = new OrderedMap(
						contribs.map( ( data ) => (
							[
								data.rev_id,
								new Revision( {
									...data,
									id: data.rev_id,
									pageId: data.page_id,
									pageNamespace: data.page_namespace,
									title: data.page_title,
									sizeDiff: data.size_diff,
									commentHidden: data.comment_hidden,
									timestamp: moment.unix( data.timestamp ).utc()
								} )
							]
						) )
					);

					const nextCont = ajaxResponse.response.continue ? ajaxResponse.response.continue : false;

					return Observable.of( addRevisions( revisions, nextCont ) );
				} )
				// If the query is no longer valid, cancel the request.
				.takeUntil( action$.ofType( 'REVISIONS_NOT_READY' ) )
				.catch( ( error ) => Observable.of( throwError( error ) ) );

			return Observable.concat(
				Observable.of( setStatusFetching() ),
				request
			);
		} )
);
